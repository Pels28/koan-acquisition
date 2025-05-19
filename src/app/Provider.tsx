"use client"

import {HeroUIProvider} from "@heroui/react";
import { ReactElement, ReactNode } from "react";

interface ProviderProps {
    children: ReactNode | ReactElement
}
 
const Provider = ({children}: ProviderProps) => {
    return <HeroUIProvider>
        {children}
    </HeroUIProvider>
}

export default Provider