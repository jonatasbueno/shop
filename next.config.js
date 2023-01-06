/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /** Definindo dominios que o next irá tratar as imagens */
  images: {
    domains: [
      'files.stripe.com'
    ]
  }
}

module.exports = nextConfig
