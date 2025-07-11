"use client"
import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { uploadImage } from '@/app/actions'
import CardComponent from '@/components/toolkit/CardComponent'
import { CardAction, WorkType } from '@/lib/definitions'
import { Button } from '@/components/ui/button'
import Modal from '@/components/toolkit/Modal'
import { Form } from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { toast } from 'sonner'
import { createWork, getWorks } from '@/app/api'

function Obras() {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File>();
    const [title, setTitle] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitData = async () => {
        if (title === "" || imageFile == null) {
            toast.error("Favor de llenar todos los datos");
        } else {
            let url = await uploadImage(imageFile);
            if (url) {
                let payload: WorkType = {
                    title: title,
                    img_url: url
                }
                let creationRes = await createWork(payload);
                if (creationRes.status == 200) {
                    toast.success('Obra registrada!')
                } else {
                    toast.error('Error al crear la publicación')
                }
            } else {
                toast.error("Hubo un problema al subir la imagen");
            }
        }
    }

    const getWorksData = async() => {
        let worksRes = await getWorks();

    }

    useEffect(() => {
        getWorksData();
    }, []);
    
    return (
        <>
            <Modal title='Registro de Obra' open={modalOpen} setOpen={setModalOpen}>
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="picture">Portada</Label>
                    <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                {imagePreview &&
                    <div className="w-full flex items-center justify-center py-5">
                        <Image src={imagePreview} alt="Blogpost Cover" width={400} height={200} />
                    </div>
                }
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="title">Titulo</Label>
                    <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button className='' onClick={() => submitData()}>
                        Registrar
                    </Button>
                </DialogFooter>
            </Modal>
            <div className="w-full py-4 flex items-center justify-between">
                <h1 className='text-lg font-semibold text-center'>Obras</h1>
                <Button onClick={() => setModalOpen(true)}>Agregar Obra</Button>
            </div>
            <CardComponent>
                <p>a</p>
            </CardComponent>
        </>
    )
}

export default Obras