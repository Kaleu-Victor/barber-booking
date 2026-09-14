import Header from '../../components/landing/Header'
import Hero from '../../components/landing/Hero'
import Services from '../../components/landing/Services'

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Services />
      </main>
    </>
  )
}

export default Home