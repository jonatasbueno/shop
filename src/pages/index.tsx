import { HomeContainer, Product } from "../styles/pages/Home";

export default function Home() {
  return (
    <HomeContainer>
      <Product>
        {/* <Image src="" width={520} height={400} /> */}
        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>
    </HomeContainer>
  )
}
