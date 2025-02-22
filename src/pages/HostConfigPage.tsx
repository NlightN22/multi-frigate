import { Button, Flex, useMantineTheme } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Editor, { Monaco } from '@monaco-editor/react';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import * as monaco from "monaco-editor";
import { SchemasSettings, configureMonacoYaml } from 'monaco-yaml';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { GetFrigateHost } from '../services/frigate.proxy/frigate.schema';
import OverlayCogwheelLoader from '../shared/components/loaders/OverlayCogwheelLoader';
import { isProduction } from '../shared/env.const';
import { SaveOption } from '../types/saveConfig';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';


window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case 'yaml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
      default:
        throw new Error(`Unknown label ${label}`)
    }
  }
}

export const hostConfigPageQuery = {
  searchWord: 'searchWord',
}

const HostConfigPage = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search])
  const host = useRef<GetFrigateHost | undefined>()

  let { id } = useParams<'id'>()
  const { isAdmin, isLoading: adminLoading } = useAdminRole()
  const theme = useMantineTheme();
  const { isPending: configPending, error: configError, data: config, refetch } = useQuery({
    queryKey: [frigateQueryKeys.getFrigateHost, id],
    queryFn: async () => {
      host.current = await frigateApi.getHost(id || '')
      const hostName = mapHostToHostname(host.current)
      if (!hostName) return null
      return proxyApi.getHostConfigRaw(hostName)
    },
  })

  const { mutate: saveConfig } = useMutation({
    mutationKey: [frigateQueryKeys.postHostConfig],
    mutationFn: ({ saveOption, config }: { saveOption: SaveOption, config: string }) => {
      const hostName = mapHostToHostname(host.current)
      if (!hostName || !editorRef.current) return Promise.resolve(null)
      return proxyApi.postHostConfig(hostName, saveOption, config)
        .catch(error => {
          if (error.response && error.response.data) {
            return Promise.reject(error.response.data)
          }
          return Promise.reject(error)
        })
    },
    onSuccess: (data) => {
      notifications.show({
        id: data?.message,
        withCloseButton: true,
        autoClose: 5000,
        title: `Sucess: ${data?.success}`,
        message: data?.message,
        color: 'green',
        icon: <IconCircleCheck />
      })
    },
    onError: (e) => {
      notifications.show({
        id: e.message,
        withCloseButton: true,
        autoClose: false,
        title: t('error'),
        message: e.message,
        color: 'red',
        icon: <IconAlertCircle />,
      })
    }
  })

  const clipboard = useClipboard({ timeout: 500 })

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function handleEditorWillMount(monaco: Monaco) {
    const hostName = mapHostToHostname(host.current)
    if (!hostName) return
    const schemaURL = proxyApi.configSchemaURL(hostName)
    const defaultSchema: SchemasSettings = {
      uri: schemaURL,
      fileMatch: ['monaco-yaml.yaml']
    }
    configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [defaultSchema]
    })
  }

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    const model = monaco.editor.createModel(config, 'yaml', monaco.Uri.parse('monaco-yaml.yaml'))
    editor.setModel(model)
    editorRef.current = editor;
    const paramSearchWord = queryParams.get(hostConfigPageQuery.searchWord)

    if (paramSearchWord && model) {
      const matches = model.findMatches(paramSearchWord, true, false, true, null, true);

      if (matches.length > 0) {
        const firstMatch = matches[0].range;
        editor.revealPositionInCenter({ lineNumber: firstMatch.startLineNumber, column: firstMatch.startColumn });
        editor.setPosition({ lineNumber: firstMatch.startLineNumber, column: firstMatch.startColumn });
      }
    }
  }

  const handleCopyConfig = useCallback(async () => {
    if (!editorRef.current) {
      return;
    }

    clipboard.copy(editorRef.current.getValue());
  }, [editorRef, clipboard]);

  const onHandleSaveConfig = useCallback(
    async (saveOption: SaveOption) => {
      if (!editorRef.current) {
        throw Error(t('frigateConfigPage.editorNotExist'))
      }
      if (!isProduction) console.log('saveOption', saveOption)
      if (!isProduction) console.log('editorRef.current', editorRef.current.getValue().slice(0, 50))
      saveConfig({ saveOption: saveOption, config: editorRef.current.getValue() })
    }, [editorRef])

  if (configPending || adminLoading) return <OverlayCogwheelLoader />

  if (configError) return <RetryErrorPage onRetry={refetch} />
  if (!isAdmin) return <Forbidden />

  return (
    <Flex direction='column' h='100%' w='100%' justify='stretch'>
      <Flex w='100%' justify='center' wrap='nowrap'>
        <Button size="sm" onClick={handleCopyConfig}>
          {t('frigateConfigPage.copyConfig')}
        </Button>
        <Button ml='1rem' size="sm" onClick={(_) => onHandleSaveConfig(SaveOption.SaveRestart)}>
          {t('frigateConfigPage.saveAndRestart')}
        </Button>
        <Button ml='1rem' size="sm" onClick={(_) => onHandleSaveConfig(SaveOption.SaveOnly)}>
          {t('frigateConfigPage.saveOnly')}
        </Button>
      </Flex>
      <Flex h='100%' mt='1rem'>
        <Editor
          defaultLanguage='yaml'
          value={config}
          defaultValue="// Data empty"
          theme={theme.colorScheme === "dark" ? "vs-dark" : "vs-light"}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </Flex>
    </Flex>
  );

}

export default observer(HostConfigPage);