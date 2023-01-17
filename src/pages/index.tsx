import { GetStaticProps } from 'next';
import Image from 'next/image'
import Link from "next/link"
import { useKeenSlider } from "keen-slider/react"
import Stripe from 'stripe';

import { stripe } from '../lib/stripe';
import { HomeContainer, Product } from "../styles/pages/Home";
import Head from 'next/head';

interface HomeProps {
  products: {
    id: string,
    name: string,
    imageUrl: string,
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <>
      {/**
       * Existe um plugin muito interessante do NextJs chamado 'next-seo'
       * trazendo diversar features para ti auxiliar no configuração de SEO da 
       * sua página
       */}
      <Head>
        <title>Home | Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => (
          /** 'prefetch' property é responsável por permitir que o mecanismo do
           * NextJs pré carregue as páginas antes mesmo de abríla quando true
           *  (use com cuidado)
           */
          <Link href={`product/${product.id}`} key={product.id} prefetch={false}>
            <Product className='keen-slider__slide'>
              <Image src={product.imageUrl} width={520} height={400} alt='' priority />
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))}

      </HomeContainer>
    </>
  )
}


/** 
 * o método getServerSideProps irá ser executado no Node Server a cada request 
 * feito para carregar a página, afim de injetar propriedades para a page 
 * requisitada
 */


/**
 * o método getStaticProps ir[a er executado no momento do build e criará páginas
 * integralmente staticas e ficaram armazenadas numa CDN até que seu tempo limite
 * seja excedido (tempo definito no parametro 'revalidate' no retorno do método)
 */
export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    /** Necessário nessa api para aplicação de expand em seu response */
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    /** Forçando type de Price no parametro default_price */
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      /** os preços são salvos em centavos (uma boa prática pra evitar problemas de vírgula) */
      price: new Intl.NumberFormat('pr-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price?.unit_amount ? price.unit_amount / 100 : 0)
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 /** 2 horas */
  }
}
