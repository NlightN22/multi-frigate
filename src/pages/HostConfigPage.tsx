import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { Button, Flex, useMantineTheme } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import Editor, { Monaco } from '@monaco-editor/react'
import * as monaco from "monaco-editor";
import CenterLoader from '../shared/components/loaders/CenterLoader';
import RetryErrorPage from './RetryErrorPage';
import { useAdminRole } from '../hooks/useAdminRole';
import Forbidden from './403';
import { observer } from 'mobx-react-lite';


const HostConfigPage = () => {
  const executed = useRef(false)
  const { sideBarsStore } = useContext(Context)

  let { id } = useParams<'id'>()
  const { isAdmin, isLoading: adminLoading } = useAdminRole()
  const theme = useMantineTheme();
  const { isPending: configPending, error: configError, data: config, refetch } = useQuery({
    queryKey: [frigateQueryKeys.getFrigateHost, id],
    queryFn: async () => {
      const host = await frigateApi.getHost(id || '')
      const hostName = mapHostToHostname(host)
      if (hostName)
        return proxyApi.getHostConfigRaw(hostName)
      return null
    },
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
    async (save_option: string) => {
      if (!editorRef.current) {
        return;
      }
      console.log('save config', save_option)
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
        <Button ml='1rem' size="sm" onClick={(_) => onHandleSaveConfig("restart")}>
          Save & Restart
        </Button>
        <Button ml='1rem' size="sm" onClick={(_) => onHandleSaveConfig("saveonly")}>
          Save Only
        </Button>
      </Flex>
      <Flex h='100%'>
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