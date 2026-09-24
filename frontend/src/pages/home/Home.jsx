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

      <footer style={{ textAlign: 'center', padding: '2rem', marginTop: '2rem', borderTop: '1px solid #eaeaea' }}>
        <a href="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
          Área do Barbeiro
        </a>
      </footer>
    </>
  )
}

export default Home