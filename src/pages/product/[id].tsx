import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image"
import { useRouter } from "next/router";
import Stripe from "stripe";

import { stripe } from "../../lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/Product";

interface ProductProps {
  product: {
    id: string,
    name: string,
    imageUrl: string,
    price: string,
    description: string
  }
}

export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter();

  /** Quando 'getStaticPaths' tem como retorn o param 'fallback' com o valor de 
   * 'true', o hook 'useRouter' terá seu parametro de retorno 'isFallback' como
   * 'true', podendo ser utilizado para um status de Loading da página. 
   * 'isFallback' terá o seu valor retornado a false assim que o método 
   * 'getStaticProps' concluir
   */
  if (isFallback) return (
    <p>Loading...</p>
  )
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}

/** Definindo parametros que serão utilizado no método getStaticProps */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: '' } }
    ],
    /** Com 'fallback' como 'true' é possível renderizar a página enquanto 
     * o método getStaticProps é executado com o parâmetro recebido em segundo 
     * plano
     * Também é possível usar o 'blocking', desse modo a pagina fica bloqueada 
     * até que o método getStaticProps seja concluído e então a página e 
     * renderizada
     */
    fallback: true
  }
}

/** Definindo interface do ParseUrlQuery */
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id;

  if (!productId) {
    return {
      props: {}
    };
  }

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        /** os preços são salvos em centavos (uma boa prática pra evitar problemas de vírgula) */
        price: new Intl.NumberFormat('pr-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price?.unit_amount ? price.unit_amount / 100 : 0),
        description: product.description
      }
    },
    revalidate: 60 * 60 * 1
  }
}