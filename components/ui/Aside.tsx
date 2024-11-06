"use client";
import React from 'react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bolt, Settings, NotebookText, Bot, FolderSearch2, Wrench, UserRound, Landmark } from "lucide-react";

function Aside() {
    return (
        <TooltipProvider>
            <div className="pl-[200px] bg-gray-950 z-50 overflow-hidden shadow-lg shadow-slate-500">
                <aside className="inset-y fixed left-0 z-50 bg-gray-950 flex h-full flex-col border-r w-[260px]">
                    <div className="border-b p-2 w-full max-w-min overflow-hidden flex justify-center items-center ">
                        <Button className='border bg-gray-950 rounded-sm border-white p-8' aria-label="Home">
                            <Bolt className="size-8 bg-white fill-foreground" />
                            <h2 className='font-bold pl-4 md:text-lg lg:text-xl font-mono'>HEAVY TOOLS</h2>
                        </Button>
                    </div>
                    <nav className="grid gap-1 justify-center pt-8">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/equipment-directory">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg bg-muted flex justify-start items-center w-full gap-2 bg-white"
                                        aria-label="Equipment Directory"
                                    >
                                        <FolderSearch2 className="size-5" />
                                        <span>EQUIPMENT DIRECTORY</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Equipment Directory
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/tools">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg flex justify-start items-center w-full gap-2 bg-white"
                                        aria-label="Tools"
                                    >
                                        <Wrench className="size-5" />
                                        <span>TOOLS / CALCULATORS</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Tools
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/settings">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg h-12 flex justify-start w-full items-center bg-white gap-1"
                                        aria-label="Settings"
                                    >
                                        <NotebookText className="size-5" />
                                        <span className='text-xs text-justify'>DOT REGULATIONS BY STATE<br />(coming soon)</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                DOT Regulations
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/assistant">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg h-12 bg-white justify-start w-full flex items-center gap-1"
                                        aria-label="Assistance"
                                    >
                                        <Bot className="size-5" />
                                        <span className='text-xs text-justify'>BROKER ASSISTANT<br />(coming soon)</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Broker Virtual Assistant
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/settings">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg h-12 flex justify-start w-full items-center bg-white gap-1"
                                        aria-label="Settings"
                                    >
                                        <NotebookText className="size-5" />
                                        <span className='text-xs text-justify'>CARRIER SEARCH<br />(coming soon)</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Carrier Search
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/settings">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg h-12 flex justify-start w-full items-center bg-white gap-1"
                                        aria-label="Settings"
                                    >
                                        <Landmark className="size-5" />
                                        <span className='text-xs text-justify'>EQUIPMENT VALUE GUIDE<br />(coming soon)</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Equipment Value Guide
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                    <nav className="mt-auto grid gap-1 p-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/settings">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg h-12 flex justify-start w-full items-center bg-white gap-1"
                                        aria-label="Settings"
                                    >
                                        <UserRound className="size-5" />
                                        <span className='text-xs text-justify'>ACCOUNT<br />(coming soon)</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Account
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/settings">
                                    <Button
                                        variant="ghost"
                                        className="rounded-lg h-12 flex justify-start w-full items-center bg-white gap-1"
                                        aria-label="Settings"
                                    >
                                        <Settings className="size-5" />
                                        <span className='text-xs text-justify'>SETTINGS<br />(coming soon)</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={7}>
                                Settings
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </aside>
            </div>
        </TooltipProvider>
    );
}

export default Aside;