import { Button, Flex, Text, useMantineTheme } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import Editor, { Monaco } from '@monaco-editor/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import * as monaco from "monaco-editor";
import { SchemasSettings, configureMonacoYaml } from 'monaco-yaml';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { GetFrigateHost } from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { isProduction } from '../shared/env.const';
import { SaveOption } from '../types/saveConfig';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';


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

const HostConfigPage = () => {
  const executed = useRef(false)
  const host = useRef<GetFrigateHost | undefined>()
  const { sideBarsStore } = useContext(Context)

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
        title: "Error",
        message: e.message,
        color: 'red',
        icon: <IconAlertCircle />,
    })
    }
  })

  useEffect(() => {
    if (!executed.current) {
      sideBarsStore.rightVisible = false
      sideBarsStore.setLeftChildren(null)
      sideBarsStore.setRightChildren(null)
      executed.current = true
    }
  }, [sideBarsStore])

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
        throw Error('Editor does not exists')
      }
      if (!isProduction) console.log('saveOption', saveOption)
      if (!isProduction) console.log('editorRef.current', editorRef.current.getValue().slice(0, 50))
      saveConfig({ saveOption: saveOption, config: editorRef.current.getValue() })
    }, [editorRef])

  if (configPending || adminLoading ) return <CenterLoader />

  if (configError) return <RetryErrorPage onRetry={refetch} />
  if (!isAdmin) return <Forbidden />

  return (
    <Flex direction='column' h='100%' w='100%' justify='stretch'>
      <Flex w='100%' justify='center' wrap='nowrap'>
        <Button size="sm" onClick={handleCopyConfig}>
          Copy Config
        </Button>
        <Button ml='1rem' size="sm" onClick={(_) => onHandleSaveConfig(SaveOption.SaveRestart)}>
          Save & Restart
        </Button>
        <Button ml='1rem' size="sm" onClick={(_) => onHandleSaveConfig(SaveOption.SaveOnly)}>
          Save Only
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