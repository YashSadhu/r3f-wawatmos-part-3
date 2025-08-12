import React from 'react';

const LinksPage = ({ setShowLinksPage }) => {
  const links = [
    {
      category: "Featured Projects",
      items: [
        {
          title: "NeedItBuildIt",
          description: "Web Application for digital solutions",
          url: "https://needitbuildit.site/",
          icon: "📖"
        },
        {
          title: "Creative Portfolio",
          description: "Collection of creative works and projects",
          url: "https://drive.google.com/drive/folders/1zHvTX9ayMYKXl8AjZApwklEWbsIESgAI",
          icon: "✨"
        }
      ]
    },
    {
      category: "Fun Experiments",
      items: [
        {
          title: "Life Visualization",
          description: "Interactive visualization of human experience",
          url: "https://tubular-begonia-4c5989.netlify.app/",
          icon: "📊"
        },
        {
          title: "BuzzLoop Demo",
          description: "Interactive demo application",
          url: "https://eclectic-sunshine-4f0f7e.netlify.app/",
          icon: "📱"
        }
      ]
    },
    {
      category: "Connect With Me",
      items: [
        {
          title: "Email",
          description: "yashsadhu1605@gmail.com",
          url: "mailto:yashsadhu1605@gmail.com",
          icon: "📧"
        },
        {
          title: "X (Twitter)",
          description: "@yashsadhu09",
          url: "https://x.com/yashsadhu09",
          icon: "𝕏"
        },
        {
          title: "LinkedIn",
          description: "yash-sadhu",
          url: "https://linkedin.com/in/yash-sadhu",
          icon: "💼"
        }
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: `
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1), transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2), transparent 50%),
        #1a1a1a
      `,
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      zIndex: 1000,
      backgroundImage: `
        radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
        radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 40px 40px',
      backgroundPosition: '0 0, 20px 20px'
    }}>
      {/* Close button */}
      <button 
        onClick={() => setShowLinksPage(false)} 
        style={{ 
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.8)';
        }}
      >
        ×
      </button>
      
      {/* Main content - no scrolling needed */}
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        color: 'white'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Yashkumar Sadhu
          </h1>
          <p style={{
            fontSize: '1rem',
            opacity: 0.8,
            margin: 0
          }}>
            Creative developer and storyteller
          </p>
        </div>

        {/* Links grid - compact layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          maxWidth: '900px',
          width: '100%'
        }}>
          {links.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '15px',
                textAlign: 'center',
                opacity: 0.9,
                color: 'white'
              }}>
                {section.category}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.items.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px',
                      textDecoration: 'none',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>
                      {link.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        {link.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        {link.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          opacity: 0.6,
          fontSize: '0.8rem'
        }}>
          © 2025 Yashkumar Sadhu. Crafted with passion and creativity.
        </div>
      </div>
    </div>
  );
};

export default LinksPage;