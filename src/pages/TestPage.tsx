import { Flex, Group, useMantineTheme } from '@mantine/core';
import { Editor, Monaco } from '@monaco-editor/react';
import { observer } from 'mobx-react-lite';
import * as monaco from 'monaco-editor';
import { SchemasSettings, configureMonacoYaml } from 'monaco-yaml';
import { useContext, useEffect, useRef } from 'react';
import { Context } from '..';
import HeadSearch from '../shared/components/inputs/HeadSearch';

const Test = () => {
  const executed = useRef(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const theme = useMantineTheme();

  const { sideBarsStore } = useContext(Context)
  sideBarsStore.rightVisible = true

  useEffect(() => {
    if (!executed.current) {
      sideBarsStore.rightVisible = false
      sideBarsStore.setLeftChildren(null)
      sideBarsStore.setRightChildren(null)
      executed.current = true
    }
  }, [sideBarsStore])




  const value = `
  # Property descriptions are displayed when hovering over properties using your cursor
  property: This property has a JSON schema description
  
  
  # Titles work too!
  titledProperty: Titles work too!
  
  
  # Even markdown descriptions work
  markdown: hover me to get a markdown based description 😮
  
  
  # Enums can be autocompleted by placing the cursor after the colon and pressing Ctrl+Space
  enum:
  
  
  # Unused anchors will be reported
  unused anchor: &unused anchor
  
  
  # Of course numbers are supported!
  number: 12
  
  
  # As well as booleans!
  boolean: true
  
  
  # And strings
  string: I am a string
  
  
  # This property is using the JSON schema recursively
  reference:
    boolean: Not a boolean
  
  
  # Also works in arrays
  array:
    - string: 12
      enum: Mewtwo
      reference:
        reference:
          boolean: true
  
  
  # JSON referenses can be clicked for navigation
  pointer:
    $ref: '#/array'
  
  
  # This anchor can be referenced
  anchorRef: &anchor can be clicked as well
  
  
  # Press control while hovering over the anchor
  anchorPointer: *anchor
  
  
  formatting:       Formatting is supported too! Under the hood this is powered by Prettier. Just press Ctrl+Shift+I or right click and press Format to format this document.
  
  
  
  
  
  
  `.replace(/:$/m, ': ')

  function handleEditorWillMount(monaco: Monaco) {
    const defaultSchema: SchemasSettings = {
      uri: 'https://github.com/remcohaszing/monaco-yaml/blob/HEAD/examples/demo/src/schema.json',
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
    const model = monaco.editor.createModel(value, 'yaml', monaco.Uri.parse('monaco-yaml.yaml'))
    editor.setModel(model)
    editorRef.current = editor;
  }


  return (
    <Flex direction='column' h='100%' >
      <Flex justify='space-between' align='center' w='100%'>
        <Group
          w='25%'
        >
        </Group>
        <Group
          w='50%'
          style={{
            justifyContent: 'center',
          }}
        ><HeadSearch /></Group>
        <Group
          w='25%'
          position="right">
        </Group>
      </Flex>
      <Flex justify='center' h='100%' direction='column' >
      <Editor
          defaultLanguage='yaml'
          value={value}
          defaultValue="// Data empty"
          theme={theme.colorScheme === "dark" ? "vs-dark" : "vs-light"}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </Flex>
    </Flex>
  );
}

export default observer(Test);