
import { LayoutProvider } from "../layout/context/layoutcontext";

import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "../styles/demo/Demos.scss";
import "../styles/layout/layout.scss";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import Footer from "./components/footer";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const value = {
        ripple: true,
        
    };
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    id="theme-link"
                    href={`/theme/theme-light/indigo/theme.css`}
                    rel="stylesheet"
                ></link>
            </head>
            <body>
                
                {/* <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider> */}
                <StackProvider app={stackServerApp}>
          <StackTheme>
            <PrimeReactProvider>
            {/* {children} */}
            <LayoutProvider>{children}</LayoutProvider>
            <div className="fixed bottom-0  right-0 left-0 ">
            <div className="flex align-self-center align-items-center justify-content-center ">
							<Footer />
						</div>
            </div>
            </PrimeReactProvider>
          </StackTheme>
        </StackProvider>
                
                
            </body>
        </html>
    );
}
