"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { type LeadFormData, leadFormSchema } from "@/src/schemas"
import { useState } from "react"
import { formatPhoneNumber, truncateFileName } from "@/src/utils"
import { FileIcon } from "lucide-react"
import { toast } from "sonner"
import { useCreateLead } from "@/src/hooks"

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      files: [],
    },
  })

  const {mutateAsync: createLeadFn} = useCreateLead()

  function onSubmit(data: LeadFormData) {
    const toastId = toast.loading("Enviando...")  

    createLeadFn(data)
      .then(() => {
        toast.success("Lead cadastrado com sucesso", {
          id: toastId,
        })
        form.reset()
        setSelectedFiles([])
      })
      .catch((error) => {
        const status = error.response?.status || 500

        if (status === 400 || status === 412) {
          toast.warning(error.response.data.message, {
            id: toastId,
          })
          return
        }
        
        toast.error("Erro ao cadastrar lead", {
          id: toastId,
        })
      })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter((file) => {
      const isValid = file.type === "application/pdf" 
      if (!isValid) {
        toast.error(`Arquivo "${file.name}" inválido. Use apenas PDFs.`)
      }
      return isValid
    })

    setSelectedFiles(pdfFiles)
    form.setValue("files", pdfFiles)
    form.trigger("files")
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Simular</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        field.onChange(formatted)
                      }}
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivos (PDF)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf"
                      className="cursor-pointer"
                      onChange={handleFileChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-secondary flex items-center gap-2 overflow-hidden"
                  >
                    <FileIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate" title={file.name}>
                      {truncateFileName(file.name)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full">
              Enviar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

