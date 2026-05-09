import Whatsapp from "../public/whatsapp.png";
import Facebook from "../public/facebook.png";

import Image from "next/image";

export default function FloatingSocial() {
  const SOCIAL_LINKS = {
    whatsapp: "https://wa.me/254708115669", // Replace with your WhatsApp number
    facebook: "https://www.facebook.com/Jomosbakehouse", // Replace with your Facebook URL
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
      zIndex: 150,
    }}>
      {/* WhatsApp Button */}
      <a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
      >
        <Image src={Whatsapp} alt="WhatsApp" width={30} height={30} />
      </a>

      {/* Facebook Button */}
      <a
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#1877F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
      >
        <Image src={Facebook} alt="Facebook" width={30} height={30} />
      </a>
    </div>
  );
}