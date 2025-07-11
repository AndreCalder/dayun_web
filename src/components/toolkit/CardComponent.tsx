"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button';

function CardComponent({
    title,
    subtitle,
    children,
    action
}: Readonly<{
    title?: string,
    subtitle?: string,
    children: React.ReactNode,
    action?: {
        text: string,
        function: () => void
    }
}>) {
    return (
        <Card className='w-full h-fit'>
            {((title != undefined || subtitle != undefined) && action != undefined) && (
                <CardHeader className='grid grid-cols-12 py-2'>

                    <div className='col-span-12 sm:col-span-9'>
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>
                            {subtitle}
                        </CardDescription>
                    </div>
                    { action  && (
                        <div className="col-span-12 sm:col-span-3 flex justify-center items-center">
                            <Button onClick={action.function} className=''>{action?.text}</Button>
                        </div>
                    )}
                </CardHeader>
            )}
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default CardComponent