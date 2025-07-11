import React from 'react'

const TableComponent = ({
    columns,
    rows,
    pagination
}: Readonly<{
    columns: Array<string>;
    rows: Array<React.ReactNode>;
    pagination: boolean;
}>) => {

    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [totalPages, setTotalPages] = React.useState<number>(Math.ceil(rows.length / 10));

    const handlePagination = (action: string) => {
        if (action === "prev") {
            if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
            }
        } else if (action === "next") {
            if (currentPage < (totalPages - 1)) {
                setCurrentPage(currentPage + 1);
            }
        }
    }
    return (
        <>
            <div className={`hidden md:grid grid-cols-${columns.length} items-center py-2.5 border-b-[1px]`}>
                {
                    columns.map((column, index) => {
                        return (
                            <p key={index} className='font-semibold'>{column}</p>
                        )
                    })
                }
            </div>
            {
                rows.map((row, index) => {
                    return (
                        row
                    )
                })
            }
            {
                pagination && (
                    <div className="w-full flex items-center gap-2.5 py-2 justify-end">

                        <div className="w-fit flex flex-col align-bo justify-end">
                            <div className="w-fit flex gap-2.5">
                                <button onClick={() => handlePagination("prev")} disabled={currentPage == 0} className={`${currentPage == 0 ? "bg-gray-400" : "bg-primary"} text-white px-3 py-1.5 rounded-lg`}>Anterior</button>
                                <button onClick={() => handlePagination("next")} disabled={currentPage >= (totalPages - 1)} className={`${currentPage >= (totalPages - 1) ? "bg-gray-400" : "bg-primary"} text-white px-3 py-1.5 rounded-lg`}>Siguiente</button>
                            </div>
                            <p className='text-sm'>Mostrando: {(currentPage * 10) + 1} - {(currentPage + 1) * 10} de {totalPages}</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default TableComponent