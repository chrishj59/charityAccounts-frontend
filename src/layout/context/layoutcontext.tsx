"use client";
import type {
    Breadcrumb,
    ChildContainerProps,
    LayoutConfig,
    LayoutContextProps,
    LayoutState,
} from "@/types";
import { Viewport } from "next";
import Head from "next/head";
import React, { useState } from "react";

export const LayoutContext = React.createContext({} as LayoutContextProps);
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  
}
export const LayoutProvider = (props: ChildContainerProps) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: true,
        inputStyle: "outlined",
        menuMode: "slim-plus",
        menuTheme: "colorScheme",
        colorScheme: "light",
        theme: "purple",
        scale: 14,
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        overlaySubmenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        resetMenu: false,
        sidebarActive: false,
        anchored: false,
    });

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive,
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive:
                    !prevLayoutState.staticMenuDesktopInactive,
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
            }));
        }
    };

    const showConfigSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            configSidebarVisible: true,
        }));
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
        }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === "overlay";
    };

    const isSlim = () => {
        return layoutConfig.menuMode === "slim";
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === "slim-plus";
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === "horizontal";
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showConfigSidebar,
        showProfileSidebar,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        breadcrumbs,
        setBreadcrumbs,
    };
  
    return (
        <LayoutContext.Provider value={value}>
            <>
                <Head>
                    <title>Rationes Charity Accounting</title>
                    <meta charSet="UTF-8" />
                    <meta
                        name="description"
                        content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
                    />
                    <meta name="robots" content="index, follow" />
                    
                    <meta property="og:type" content="website"></meta>
                    <meta
                        property="og:title"
                        content="Charity Accounting by Rationes Charitatis"
                    ></meta>
                    <meta
                        property="og:url"
                        content="https://www.rationes-charitatis"
                    ></meta>
                    <meta
                        property="og:description"
                        content="Charity accounting solution for Charities and others needing restricted funds accounting"
                    />
                    <meta
                        property="og:image"
                        content="https://www.rationes-charitatis/images/ecomony.svg"
                    ></meta>
                    <meta property="og:ttl" content="604800"></meta>
                    <link
                        rel="icon"
                        href={`/favicon.ico`}
                        type="image/x-icon"
                    ></link>
                </Head>
                {props.children}
            </>
        </LayoutContext.Provider>
    );
};
