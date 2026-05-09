import Image from "next/image";
import  About1 from "../public/About1.jpg"
import About2 from "../public/About2.jpg"
import About3 from "../public/About3.jpg"


const T = {
  greenDeep: "#0A1F0D",
  greenDark: "#122A16",
  greenMid: "#1E4D24",
  greenBrand: "#2D7A38",
  greenLight: "#4CAF57",
  yellowGold: "#F0C419",
  yellowWarm: "#E8A900",
  yellowPale: "#FFFBDF",
  offWhite: "#F5F5EE",
  black: "#080C08",
};

const aboutBlocks = [
  {
    title: "Crafted with Passion",
    subtitle: "Every loaf tells a story",
    text: "Jomos Bakers was born from a simple obsession: the perfect crust. What started as weekend baking in a small Gachie kitchen grew into one of Nairobi’s most loved artisan bakeries. Every recipe is rooted in patience, precision, and love.",
    image: About1,
    reverse: false,
  },
  {
    title: "Fresh Ingredients",
    subtitle: "Only the best makes the cut",
    text: "We believe exceptional baking starts with exceptional ingredients. From locally sourced flour to fresh dairy and farm-picked fruits, every ingredient is selected to create flavor that feels honest and unforgettable.",
    image: About2,
    reverse: true,
  },
  {
    title: "Baked for Community",
    subtitle: "More than bread, it’s belonging",
    text: "Our bakery is a place where stories are shared over warm pastries and coffee. We serve moments, not just meals—creating comfort, connection, and a little everyday magic for our Nairobi community.",
    image: About3,
    reverse: false,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: T.greenDeep,
        padding: "120px 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "1px",
          height: "80px",
          background: `linear-gradient(to bottom, transparent, ${T.yellowGold})`,
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Section Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "6rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              color: T.yellowGold,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            ◆ About Us
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: T.offWhite,
              lineHeight: 1.1,
              marginBottom: "1.2rem",
            }}
          >
            A Beautiful Story,<br />
            <em style={{ color: T.yellowGold }}>
              Baked Into Every Detail
            </em>
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontFamily: "'Outfit', sans-serif",
              color: "rgba(245,245,238,0.68)",
              lineHeight: 1.8,
              fontSize: "1rem",
            }}
          >
            Not just a bakery but an experience. Every corner, every loaf, every
            bite is designed to feel warm, memorable, and deeply human.
          </p>
        </div>

        {/* Alternating About Blocks */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7rem",
          }}
        >
          {aboutBlocks.map((block, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4rem",
                alignItems: "center",
              }}
            >
              {/* IMAGE SIDE */}
              <div
                style={{
                  order: block.reverse ? 2 : 1,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    minHeight: "500px",
                    borderRadius: "18px",
                    background: `linear-gradient(145deg, ${T.greenMid}, ${T.greenDark})`,
                    border: `1px solid rgba(240,196,25,0.12)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8rem",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.25), inset 0 0 50px rgba(0,0,0,0.2)",
                    position: "relative",
                  }}
                >
                  <Image
                    src={block.image}
                    alt={block.title}
                    fill
                    style={{ objectFit: "cover", borderRadius: "18px" }}
                  />
                </div>
              </div>

              {/* TEXT SIDE */}
              <div
                style={{
                  order: block.reverse ? 1 : 2,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.8rem",
                    color: T.yellowGold,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                    marginBottom: "1rem",
                  }}
                >
                  ◆ {block.subtitle}
                </p>

                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    color: T.offWhite,
                    lineHeight: 1.15,
                    marginBottom: "1.5rem",
                  }}
                >
                  {block.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    color: "rgba(245,245,238,0.68)",
                    lineHeight: 1.9,
                    fontSize: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  {block.text}
                </p>

                <div
                  style={{
                    width: "80px",
                    height: "2px",
                    background: T.yellowGold,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Banner — Since 2022. Nairobi */}
        <div
          style={{
            marginTop: "8rem",
            paddingTop: "4rem",
            borderTop: `1px solid rgba(240,196,25,0.2)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 700,
              color: T.yellowGold,
              marginBottom: "0.5rem",
            }}
          >
            Since 2024.
          </div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(245,245,238,0.6)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}
          >
            Nairobi, Kenya
          </div>
        </div>
      </div>
    </section>
  );
}