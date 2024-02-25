import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { Button, Flex, Text, useMantineTheme } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { configureMonacoYaml } from "monaco-yaml";
import Editor, { DiffEditor, useMonaco, loader, Monaco } from '@monaco-editor/react'
import * as monaco from "monaco-editor";
import CenterLoader from '../shared/components/CenterLoader';
import RetryErrorPage from './RetryErrorPage';


const HostConfigPage = () => {
  let { id } = useParams<'id'>()
  const queryClient = useQueryClient()
  const theme = useMantineTheme();
  const { isPending: configPending, error: configError, data: config, refetch } = useQuery({
    queryKey: [frigateQueryKeys.getFrigateHost, id],
    queryFn: async () => {
      const host = await frigateApi.getHost(id || '')
      const hostName = mapHostToHostname(host)
      return proxyApi.getHostConfigRaw(hostName)
    },
  })


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
  }, [editorRef]);

  const onHandleSaveConfig = useCallback(
    async (save_option: string) => {
      if (!editorRef.current) {
        return;
      }
      console.log('save config', save_option)
    }, [editorRef])

  if (configPending) return <CenterLoader />

  if (configError) return <RetryErrorPage onRetry={refetch} />

  return (
    <Flex direction='column' h='100%' w='100%' justify='stretch'>
      <Flex w='100%' justify='center' wrap='nowrap'>
        <Button
          size="sm"
          className="mx-1"
          onClick={handleCopyConfig}
        >
          Copy Config
        </Button>
        <Button
          size="sm"
          className="mx-1"
          onClick={(_) => onHandleSaveConfig("restart")}
        >
          Save & Restart
        </Button>
        <Button
          size="sm"
          className="mx-1"
          onClick={(_) => onHandleSaveConfig("saveonly")}
        >
          Save Only
        </Button>
      </Flex>
      <Flex h='100%'>
        <Editor
          defaultLanguage='yaml'
          value={config}
          defaultValue="// Data empty"
          theme={theme.colorScheme == "dark" ? "vs-dark" : "vs-light"}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </Flex>
    </Flex>
  );

}

export default HostConfigPage;