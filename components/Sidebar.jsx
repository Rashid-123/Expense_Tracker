"use client";

import { LayoutDashboard, Wallet, CreditCard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
        },
        {
            name: "Budgets",
            icon: Wallet,
            href: "/budgets",
        },
        {
            name: "Transactions",
            icon: CreditCard,
            href: "/transactions",
        },
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>

            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed top-4 left-4 z-60 bg-white shadow-xs border border-gray-200"
                onClick={toggleSidebar}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>


            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-transparent bg-opacity-50 z-40"
                    onClick={closeSidebar}
                />
            )}


            <div
                className={`
                    w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0 z-50' : '-translate-x-full z-30'}
                    lg:translate-x-0 lg:z-30
                `}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-8 mt-8 lg:mt-0">
                        Expense Tracker
                    </h2>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Button
                                    key={item.name}
                                    variant={isActive ? "default" : "ghost"}
                                    className={`w-full justify-start h-11 px-4 ${isActive
                                        ? "bg-gray-900 text-white hover:bg-gray-800"
                                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                    asChild
                                    onClick={closeSidebar}
                                >
                                    <Link href={item.href}>
                                        <Icon className="mr-3 h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}