"use client"

import { uploadPDF } from '@/app/actions'
import { createCatalog, getCatalogs, deleteCatalog } from '@/app/api'
import CardComponent from '@/components/toolkit/CardComponent'
import Modal from '@/components/toolkit/Modal'
import TableComponent from '@/components/toolkit/TableComponent'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CatalogType } from '@/lib/definitions'
import { FileText, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

function Catalog() {

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [pdfFile, setPdfFile] = React.useState<File | null>(null);
    const [submitted, setSubmitted] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [catalogData, setCatalogData] = React.useState<Array<CatalogType>>([]);
    const [columns, setColumns] = React.useState<Array<string>>(["Título", "Tipo", "Descripción", "Fecha", "Acciones"]);

    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [type, setType] = React.useState<"paintings" | "illustrations">("paintings");

    const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            toast.error("Por favor selecciona un archivo PDF válido");
        }
    };

    const submitData = async () => {
        if (title === "" || !pdfFile) {
            toast.error("Favor de llenar el título y seleccionar un archivo PDF");
        } else {
            setIsLoading(true);
            
            const formData = new FormData();
            formData.append('file', pdfFile);
            
            // First upload to Supabase
            const pdfUrl = await uploadPDF(formData);

            if (!pdfUrl) {
                toast.error('Error al subir el PDF a Supabase');
                setIsLoading(false);
                return;
            }

            // Then save to backend
            let payload: CatalogType = {
                title: title,
                description: description || undefined,
                pdf_url: pdfUrl,
                type: type
            }

            try {
                let creationRes = await createCatalog(payload);

                if (creationRes.status == 200) {
                    setSubmitted(!submitted);
                    setModalOpen(false);
                    setTitle("");
                    setDescription("");
                    setType("paintings");
                    setPdfFile(null);
                    toast.success('Catálogo registrado exitosamente!');
                } else {
                    toast.error('Error al crear el catálogo en la base de datos');
                }
            } catch (error) {
                toast.error('Error al crear el catálogo');
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este catálogo?")) {
            try {
                let response = await deleteCatalog(id);
                if (response.status == 200) {
                    toast.success('Catálogo eliminado');
                    setSubmitted(!submitted);
                } else {
                    toast.error('Error al eliminar el catálogo');
                }
            } catch (error) {
                toast.error('Error al eliminar el catálogo');
            }
        }
    }

    const getCatalogData = async () => {
        try {
            let response = await getCatalogs();

            if (response.status == 200) {
                setCatalogData(response.data.catalogs);
            } else {
                toast.error('Error al obtener los datos');
            }
        } catch (error) {
            toast.error('Error al obtener los datos');
        }
    }

    const formatDate = (dateObj: any) => {
        if (!dateObj?.$date) return 'N/A';
        const date = new Date(dateObj.$date);
        return date.toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    useEffect(() => {
        getCatalogData();
    }, [submitted]);

    return (
        <>
            <Modal title='Agregar Catálogo' open={modalOpen} setOpen={setModalOpen}>
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="pdf">Archivo PDF *</Label>
                    <Input 
                        id="pdf" 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handlePdfUpload}
                    />
                    {pdfFile && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{pdfFile.name}</span>
                        </div>
                    )}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input 
                        id="title" 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Catálogo 2025"
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as "paintings" | "illustrations")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="paintings">Pinturas (Paintings)</option>
                        <option value="illustrations">Ilustraciones (Illustrations)</option>
                    </select>
                </div>
                <div className="w-full items-center gap-1.5 py-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea 
                        className='w-full' 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del catálogo (opcional)"
                    />
                </div>
                <DialogFooter>
                    <Button 
                        className='' 
                        onClick={() => submitData()}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Subiendo...' : 'Registrar'}
                    </Button>
                </DialogFooter>
            </Modal>
            <div className="w-full py-4 flex items-center justify-between">
                <h1 className='text-lg font-semibold text-center'>Catálogos</h1>
                <Button onClick={() => setModalOpen(true)}>Agregar Catálogo</Button>
            </div>
            <CardComponent>
                <div className="py-4">
                    {catalogData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No hay catálogos registrados
                        </div>
                    ) : (
                        <TableComponent
                            columns={columns}
                            pagination={false}
                            rows={catalogData.map((catalog, index) => {
                                return (
                                    <div key={index}>
                                        <div className={`grid grid-cols-5 gap-4 items-center py-3 ${index < catalogData.length - 1 && "border-b-[1px]"}`}>
                                            <div className="col-span-1">
                                                <p className='font-semibold'>{catalog.title}</p>
                                            </div>
                                            <div className="col-span-1">
                                                <p className='text-sm text-gray-600'>
                                                    {catalog.type === 'paintings' ? 'Pinturas' : 'Ilustraciones'}
                                                </p>
                                            </div>
                                            <div className="col-span-1">
                                                <p className='text-sm text-gray-600 truncate'>
                                                    {catalog.description || 'Sin descripción'}
                                                </p>
                                            </div>
                                            <div className="col-span-1">
                                                <p className='text-sm text-gray-600'>
                                                    {formatDate(catalog.created_at)}
                                                </p>
                                            </div>
                                            <div className="col-span-1 flex gap-2">
                                                <a 
                                                    href={catalog.pdf_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-fit p-2 rounded-lg bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors"
                                                >
                                                    <FileText className='w-5 h-5 text-white' />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(catalog._id?.$oid || '')}
                                                    className="w-fit p-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer transition-colors"
                                                >
                                                    <Trash2 className='w-5 h-5 text-white' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        />
                    )}
                </div>
            </CardComponent>
        </>
    )
}

export default Catalog

