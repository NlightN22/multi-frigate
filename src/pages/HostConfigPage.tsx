import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { useMutation, useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { Button, Flex, useMantineTheme, Text } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import Editor, { Monaco } from '@monaco-editor/react'
import * as monaco from "monaco-editor";
import CenterLoader from '../shared/components/loaders/CenterLoader';
import RetryErrorPage from './RetryErrorPage';
import { useAdminRole } from '../hooks/useAdminRole';
import Forbidden from './403';
import { observer } from 'mobx-react-lite';
import { isProduction } from '../shared/env.const';
import { SaveOption } from '../types/saveConfig';
import { GetFrigateHost } from '../services/frigate.proxy/frigate.schema';
import { error } from 'console';


const HostConfigPage = () => {
  const executed = useRef(false)
  const host = useRef<GetFrigateHost | undefined>()
  const { sideBarsStore } = useContext(Context)
  const [saveMessage, setSaveMessage] = useState<string>()

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
      setSaveMessage(data?.message)
    },
    onError: (error) => {
      setSaveMessage(error.message)
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
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    // TODO add yaml schema
    // const modelUri = monaco.Uri.parse("http://localhost:4000/proxy/api/config/schema.json?hostName=localhost:5001")
    // configureMonacoYaml(monaco, {
    //   enableSchemaRequest: true,
    //   hover: true,
    //   completion: true,
    //   validate: true,
    //   format: true,
    //   schemas: [
    //     {
    //       uri: `http://localhost:4000/proxy/api/config/schema.json?hostName=localhost:5001`,
    //       fileMatch: ['**/.schema.*'],
    //     },
    //   ],
    // })
  }

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
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

  if (configPending || adminLoading) return <CenterLoader />

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
      {!saveMessage ? null :
        <Flex w='100%' justify='center' wrap='nowrap' mt='1rem'>
          <Text>{saveMessage}</Text>
        </Flex>
      }
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