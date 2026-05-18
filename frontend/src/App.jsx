import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

export default function App() {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)

  const [code, setCode] = useState(`#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  int edad;

  cin >> nombre;
  cin >> edad;

  cout << "Hola " << nombre << ", tienes " << edad << " años.";
  return 0;
}`)
  const [input, setInput] = useState(`Isaac
17`)
  const [output, setOutput] = useState('')
  const [dark, setDark] = useState(true)

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  async function runCode() {
    const res = await fetch('http://localhost:3001/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, input })
    })

    const data = await res.json()
    setOutput(data.output || data.error)
  }

  function clearAll() {
    setCode('')
    setInput('')
    setOutput('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: dark ? '#0b1120' : '#eef2ff',
      color: dark ? '#f8fafc' : '#111827',
      padding: '20px',
      fontFamily: 'Helvetica Neue, Arial'
    }}>
      <h1 style={{
        fontSize: '42px',
        fontWeight: '700',
        marginBottom: '20px',
        color: dark ? '#ffffff' : '#111827'
      }}>
        Gamez-IDE
      </h1>

      <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Editor
          height="500px"
          defaultLanguage="cpp"
          value={code}
          onChange={(v) => setCode(v || '')}
          onMount={handleEditorDidMount}
          theme={dark ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false }
          }}
        />
      </div>

      <div style={{
        marginTop: '15px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <button onClick={runCode} style={{
          padding: '12px 22px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '10px'
        }}>
          Ejecutar
        </button>

        <button onClick={clearAll} style={{
          padding: '12px 22px',
          borderRadius: '10px',
          color: dark ? 'white' : 'black'
        }}>
          Limpiar
        </button>

        <button onClick={() => setDark(!dark)} style={{
          padding: '12px 22px',
          borderRadius: '10px',
          color: dark ? 'white' : 'black'
        }}>
          {dark ? '☀️ Modo día' : '🌙 Modo noche'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        <div>
          <h3>Entrada</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '100%',
              height: '180px',
              resize: 'none',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid gray',
              background: dark ? '#1e293b' : 'white',
              color: dark ? 'white' : 'black',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <h3>Salida</h3>
          <pre style={{
            width: '100%',
            height: '180px',
            margin: 0,
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid gray',
            overflow: 'auto',
            background: dark ? '#1e293b' : 'white',
            color: dark ? 'white' : 'black',
            boxSizing: 'border-box',
            fontSize: '13px',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  )
}