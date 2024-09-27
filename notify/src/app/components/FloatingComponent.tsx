"use client";
import { useSelector } from "react-redux";
import { FloatingDoc } from "./FloatingDoc";
import {
    IconBrandGithub,
    IconBrandX,
    IconHome,
    IconNewSection,
    IconUser,
} from "@tabler/icons-react";
import "../globals.css";

export function Floating() {
    const user = useSelector((state: any) => state.user.user);

    const links = user?.username
        ? [
            {
                title: "Home",
                icon: (
                    <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "/",
            },
            {
                title: "Projects",
                icon: (
                    <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "/Notes",
            },
            {
                title: "Logout",
                icon: (
                    <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "/logout",
            },
            {
                title: "Twitter",
                icon: (
                    <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "#",
            },
            {
                title: "GitHub",
                icon: (
                    <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "https://github.com/TanishBhole0911/HTS2.0_team-hash",
            },
        ]
        : [
            {
                title: "Home",
                icon: (
                    <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "/",
            },
            {
                title: "Register",
                icon: (
                    <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "/register",
            },
            {
                title: "Login",
                icon: (
                    <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "/login",
            },
            {
                title: "GitHub",
                icon: (
                    <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "https://github.com/TanishBhole0911/HTS2.0_team-hash",
            },
        ];

    return (
        <div className="FloatingComponent">
            <FloatingDoc items={links} mobileClassName="translate-y-20" />
        </div>
    );
}