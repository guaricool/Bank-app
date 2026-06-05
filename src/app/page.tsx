import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #000000 0%, #0a0a1a 50%, #0d0d2b 100%)',
      color: '#f5f5f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: '-30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 3rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          💰 Family Finance
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/auth/login" style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '980px',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#f5f5f7',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            textDecoration: 'none',
          }}>
            Iniciar Sesión
          </Link>
          <Link href="/auth/register" style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '980px',
            background: '#0071e3',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 500,
            border: 'none',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
          }}>
            Crear Cuenta
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.4rem 1rem',
          borderRadius: '980px',
          border: '1px solid rgba(0,113,227,0.3)',
          background: 'rgba(0,113,227,0.08)',
          color: '#0071e3',
          fontSize: '0.85rem',
          fontWeight: 500,
          marginBottom: '2rem',
          letterSpacing: '0.02em',
        }}>
          ✨ Finanzas familiares inteligentes
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          maxWidth: '800px',
          margin: '0 0 1.5rem 0',
        }}>
          Toma el control de{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0071e3 0%, #64d2ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            tus finanzas
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          color: '#86868b',
          maxWidth: '600px',
          lineHeight: 1.5,
          margin: '0 0 2.5rem 0',
        }}>
          Conecta tus bancos, visualiza tus activos y pasivos, y crea estrategias de pago inteligentes. Todo en una sola plataforma segura para tu familia.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/auth/register" style={{
            padding: '0.9rem 2.2rem',
            borderRadius: '980px',
            background: '#0071e3',
            color: '#ffffff',
            fontSize: '1.05rem',
            fontWeight: 600,
            border: 'none',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}>
            Comenzar Gratis →
          </Link>
          <Link href="/auth/login" style={{
            padding: '0.9rem 2.2rem',
            borderRadius: '980px',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.05)',
            color: '#f5f5f7',
            fontSize: '1.05rem',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}>
            Ya tengo cuenta
          </Link>
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          width: '100%',
          marginTop: '5rem',
        }}>
          {[
            { icon: '🏦', title: 'Conexión Bancaria', desc: 'Vincula tus cuentas automáticamente con Plaid en segundos.' },
            { icon: '📊', title: 'Activos & Pasivos', desc: 'El sistema clasifica tus cuentas, tarjetas y préstamos.' },
            { icon: '🎯', title: 'Estrategia de Pago', desc: 'Avalancha o Bola de Nieve. Elige y visualiza tu libertad.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#86868b', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#86868b',
        fontSize: '0.8rem',
        position: 'relative',
        zIndex: 10,
      }}>
        © {new Date().getFullYear()} Family Finance. Todos los derechos reservados.
      </footer>
    </div>
  );
}
