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
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      <button 
        onClick={() => setShowLinksPage(false)} 
        style={{ 
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ×
      </button>
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        color: 'white'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Yashkumar Sadhu
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Creative developer and storyteller crafting digital experiences that blend innovation with narrative.
          </p>
        </header>

        {links.map((section, sectionIndex) => (
          <section key={sectionIndex} style={{ marginBottom: '50px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '30px',
              textAlign: 'center',
              opacity: 0.95
            }}>
              {section.category}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {section.items.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    textDecoration: 'none',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '1.5rem',
                      marginRight: '12px'
                    }}>
                      {link.icon}
                    </span>
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      margin: 0
                    }}>
                      {link.title}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: '1rem',
                    opacity: 0.8,
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}

        <footer style={{
          textAlign: 'center',
          marginTop: '80px',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          opacity: 0.7
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            © 2025 Yashkumar Sadhu. Crafted with passion and creativity.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LinksPage;