import { NavLink } from "react-router";
import { FaChevronRight, FaChevronDown, FaRegCircle } from "react-icons/fa";
import { TiHomeOutline } from "react-icons/ti";

const MenuItem = ({
  icon = <TiHomeOutline className="mx-2 fs-5" />,
  label,
  to,
  submenuItems = [],
  openSubMenu,
  handleSubmenu,
  isSubMenuOpen,
  handleToggleMenu,
  identifier,
  onNavigate, // optional
}) => {
  const hasDropdown = submenuItems.length > 0;

  return (
    <li className={hasDropdown ? "has-dropdown" : ""}>
      {hasDropdown ? (
        <a
          className={`border-0 rounded-2 d-flex justify-content-between w-100 ${
            openSubMenu && identifier === openSubMenu
              ? "bg-white bg-opacity-10"
              : ""
          }`}
          onClick={() => handleSubmenu(identifier)}
          style={{
            cursor: "pointer",
            background: "none",
            padding: "0.5rem",
            color: "#A2AED0",
          }}
          onMouseEnter={(e) => (e.target.style.color = "white")}
          onMouseLeave={(e) =>
            (e.target.style.color =
              openSubMenu && identifier === openSubMenu ? "white" : "#A2AED0")
          }
        >
          <span className="d-flex align-items-center">
            {icon}
            {label}
          </span>
          <span>
            {openSubMenu !== identifier ? (
              <FaChevronRight className="me-2" />
            ) : (
              <FaChevronDown className="me-2" />
            )}
          </span>
        </a>
      ) : to ? (
        <NavLink
          className="border-0 p-0 d-block mt-1"
          to={to}
          onClick={() => {
            if (onNavigate) onNavigate();
          }}
          style={({ isActive }) => ({
            color: isActive ? "white" : "#A2AED0",
            textDecoration: "none",
            transition: "color 0.2s ease-in-out",
            paddingLeft: "30px",
          })}
          onMouseEnter={(e) => (e.target.style.color = "white")}
          onMouseLeave={(e) =>
            (e.target.style.color = e.target.classList.contains("active")
              ? "white"
              : "#A2AED0")
          }
        >
          {icon}
          {label}
        </NavLink>
      ) : null}

      {/* Submenu Items */}
      {hasDropdown && (
        <ul
          className={`submenu ${
            isSubMenuOpen(identifier) ? "sub-menu-active" : ""
          }`}
        >
          {submenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                className="border-0 p-0"
                to={item.to}
                onClick={() => {
                  handleToggleMenu(false);
                  if (onNavigate) onNavigate();
                }}
                style={({ isActive }) => ({
                  color: isActive ? "white" : "#A2AED0",
                  textDecoration: "none",
                  transition: "color 0.2s ease-in-out",
                })}
                onMouseEnter={(e) => (e.target.style.color = "white")}
                onMouseLeave={(e) =>
                  (e.target.style.color = e.target.classList.contains("active")
                    ? "white"
                    : "#A2AED0")
                }
              >
                <FaRegCircle style={{ fontSize: "5px", marginRight: "8px" }} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
