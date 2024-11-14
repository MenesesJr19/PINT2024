import { Icone, Navegar } from "components";
import { Row } from "components/ui/Row";
import { Link } from "react-router-dom";

export const DenunciaCartao = ({ id, title, username, status }) => {
  const cardStyle = {
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "12px 20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  };

  const iconStyle = {
    fontSize: "24px",
    marginRight: "16px",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginRight: "auto",
    marginBottom: "15px",
    color: "#333",
  };

  const usernameStyle = {
    display: "flex",
    marginRight: "20px",
  };

  const statusStyle = {
    display: "flex",
    alignItems: "center",
    color: status === "Ativo" ? "#4CAF50" : "#F44336",
  };

  return (
    <Link to={`/backoffice/denuncias#denuncia-${id}`}>
      <div style={cardStyle}>
        <div style={titleStyle}>{title}</div>
        <Row>
          <Icone iconName="Person" style={iconStyle} />
          <div style={usernameStyle}>{username}</div>
          <div style={statusStyle}>
            <Icone iconName="Check2Circle" style={statusStyle} />
            &nbsp;{status}
          </div>
        </Row>
      </div>
    </Link>
  );
};
