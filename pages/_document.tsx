{/**
 * Essa página representa o "index.html"
 * 
 * - Todo conteúdo que deveria ser adicionado no "index.html" deve ser adicionado aqui
 * - Toda importação ou aquivo carregado nesse arquivo, será carregado para todo contexto e parte da aplicação como um todo
 * - Utiliza-se tags especiais para html, head e etc
 * - Isso apesar de semelhando a um template html, esse arquivo continua sendo TSX, logo precisa que sua teg sejam fechadas
 * - Devido explição no item acima, é necessário que as propriedades sigam o "camelCase"
 * - Hot Relouad não se aplica a esse arquivo, logo a acada alteração deve-se reiniciar o projeto com "npm run ..."
 */}
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
