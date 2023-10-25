import { Button } from "primereact/button";

import enotfoundimage from "@/assets/images/exception/bxs-minus-circle.svg";
import { useLocation } from "wouter";

export function NotFound404() {
  const [location, navigate] = useLocation();

  return (
    <section>
      <div className="exception-body notfound">
        <div className="exception-panel" style={{ borderRadius: "25px;" }}>
          <div className="exception-image">
            <img src={enotfoundimage} alt="Exception Icon" />
          </div>
          <div className="exception-detail">
            <div className="text-center bg-gray-200">
              <span className="font-bold text-3xl inline-block px-3">404</span>
            </div>
            <h1 className="pt-2">PÁGINA NÃO ENCONTRADA</h1>
            <p>{`Requested resource is not available. [${location}]`}</p>
            <a
              aria-label="GO TO DASHBOARD"
              onClick={() => {
                navigate("/", { replace: true });
              }}
            >
              <Button
                label="GO TO DASHBOARD"
                size={"small"}
                icon="pi pi-replay"
                tabIndex={0}
                // path='/'
              ></Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
