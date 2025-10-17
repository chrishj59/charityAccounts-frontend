import { Metadata } from "next";
import React from "react";
import AppConfig from "../../layout/AppConfig";

interface FullPageLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Rationes Charitatis Charity Accounting",

    description:
        "Charity and restrictded fund accounting mad easy"
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
    return (
        <React.Fragment>
            {children}
            <AppConfig minimal />
        </React.Fragment>
    );
}
