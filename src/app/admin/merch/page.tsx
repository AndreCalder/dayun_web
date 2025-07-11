"use client"

import { uploadImage } from '@/app/actions'
import { createMerch, getMerch } from '@/app/api'
import CardComponent from '@/components/toolkit/CardComponent'
import Modal from '@/components/toolkit/Modal'
import TableComponent from '@/components/toolkit/TableComponent'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MerchType } from '@/lib/definitions'
import { PencilIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

function Merch() {

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [imageFiles, setImageFiles] = React.useState<Array<File>>([]);
    const [imagePreviews, setImagePreviews] = React.useState<Array<string>>([]);
    const [submitted, setSubmitted] = React.useState<boolean>(false);

    const [merchData, setMerchData] = React.useState<Array<MerchType>>([]);
    const [columns, setColumns] = React.useState<Array<string>>(["Imagen", "Nombre", "Precio", "Acciones"]);

    const [name, setName] = React.useState<string>("");
    const [price, setPrice] = React.useState<number>(0);
    const [description, setDescription] = React.useState<string>("");

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImageFiles([...imageFiles, file as File]);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews([...imagePreviews, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitData = async () => {
        if (name === "" || price === 0 || description === "" || imageFiles.length == 0) {
            toast.error("Favor de llenar todos los datos");
        } else {
            let imageUploadPromises = imageFiles.map(async (file) => {
                return uploadImage(file);
            }
            );

            let imageResults: Array<string> = [];

            let imageResponses = await Promise.all(imageUploadPromises);

            imageResponses.forEach((response) => {
                if (response) {
                    imageResults.push(response);
                }
            });

            let payload: MerchType = {
                name: name,
                price: price,
                description: description,
                image_urls: imageResults
            }

            let creationRes = await createMerch(payload);

            if (creationRes.status == 200) {
                setSubmitted(!submitted);
                setModalOpen(false);
                toast.success('Obra registrada!')
            } else {
                toast.error('Error al crear la publicación')
            }
        }
    }

    const getMerchandiseData = async () => {
        let response = await getMerch();

        if (response.status == 200) {
            setMerchData(response.data);
        } else {
            toast.error('Error al obtener los datos')
        }
    }

    useEffect(() => {
        getMerchandiseData();
    }, [submitted]);

    return (
        <>
            <Modal title='Registro de Mercancía' open={modalOpen} setOpen={setModalOpen}>
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="picture">Imágenes</Label>
                    <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                {imagePreviews.length > 0 &&
                    <div className="w-full flex overflow-x-auto gap-2.5">
                        {
                            imagePreviews.map((image, index) => {
                                return (
                                    <div key={index} className='w-24 h-24 overflow-hidden rounded-lg'>
                                        <img className='w-full h-full object-cover' src={image} alt='img' />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                <div className="w-full grid grid-cols-2 gap-1.5 py-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="title">Nombre</Label>
                        <Input id="title" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="title">Precio (MXN)</Label>
                        <Input id="title" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
                    </div>
                </div>
                <div className="w-full items-center gap-1.5 py-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea className='w-full' id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button className='' onClick={() => submitData()}>
                        Registrar
                    </Button>
                </DialogFooter>
            </Modal>
            <div className="w-full py-4 flex items-center justify-between">
                <h1 className='text-lg font-semibold text-center'>Merch</h1>
                <Button onClick={() => setModalOpen(true)}>Agregar</Button>
            </div>
            <CardComponent>
                <div className="py-4">
                    <TableComponent
                        columns={columns}
                        pagination={false}
                        rows={merchData.map((merch, index) => {
                            return (
                                <div key={index}>
                                    <div key={index} className={`hidden md:grid grid-cols-${columns.length} items-center py-2.5 ${index < merchData.length - 1 && "border-b-[1px]"}`}>
                                        <div className='w-24 h-24 overflow-hidden rounded-lg col-span-1'>
                                            <img className='w-full h-full object-cover' src={merch.image_urls[0]} alt='img' />
                                        </div>
                                        <div className="col-span-1 md:hidden">
                                            <div className="flex justify-between">
                                                <p className='font-semibold'>{merch.name}</p>
                                                <Link href={`/admin/merch/${merch._id?.$oid}`}>
                                                    <div className="w-fit p-2 rounded-lg bg-primary cursor-pointer">
                                                        <PencilIcon className='w-3 h-3 text-white' />
                                                    </div>
                                                </Link>
                                            </div>

                                            <p>{merch.description}</p>
                                            <p>${merch.price.toFixed(2)}</p>

                                        </div>
                                        <p className='col-span-1'>{merch.name}</p>
                                        <p className='col-span-1'>${merch.price.toFixed(2)}</p>
                                        <Link className='col-span-1' href={`/admin/merch/${merch._id?.$oid}`}>
                                            <div className="w-fit p-2 rounded-lg bg-primary cursor-pointer">
                                                <PencilIcon className='w-6 h-6 text-white' />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className={`grid grid-cols-2 md:hidden items-center py-2.5 ${index < merchData.length - 1 && "border-b-[1px]"}`}>
                                        <div className='w-24 h-24 overflow-hidden rounded-lg col-span-1'>
                                            <img className='w-full h-full object-cover' src={merch.image_urls[0]} alt='img' />
                                        </div>
                                        <div className="col-span-1 md:hidden">
                                            <div className="flex justify-between">
                                                <p className='font-semibold'>{merch.name}</p>
                                                <Link href={`/admin/merch/${merch._id?.$oid}`}>
                                                    <div className="w-fit p-2 rounded-lg bg-primary cursor-pointer">
                                                        <PencilIcon className='w-3 h-3 text-white' />
                                                    </div>
                                                </Link>
                                            </div>
                                            <p>${merch.price.toFixed(2)}</p>

                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    />
                </div>
            </CardComponent>
        </>
    )
}

export default Merch