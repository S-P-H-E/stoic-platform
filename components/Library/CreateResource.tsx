import React, { useCallback, useEffect, useState } from 'react'
import Input from '@/components/UI Elements/Input';
import { useDropzone } from 'react-dropzone';
import { BsImageFill } from 'react-icons/bs';
import Image from 'next/image';
import Button from '../UI Elements/Button';
import { ButtonShad } from "@/components/ui/buttonshad"
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { message } from 'antd';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '@/utils/firebase';
import { MdDelete } from 'react-icons/md';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { AiFillFileAdd } from 'react-icons/ai';
import { Progress } from '../ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import clsx from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CreateTag from './CreateTag';

export default function CreateResource() {
  const [resourceName, setResourceName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resourceImageUrl, setResourceImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null); 

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDownloadLink, setFileDownloadLink] = useState<string | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState<number | null>(null);

  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);

  const { user, userId, userStatus } = UserDataFetcher();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onImageSelected(acceptedFiles[0]),
    maxSize: 20 * 1024 * 1024,
  });

  const { getRootProps: getFileRootProps, getInputProps: getFileInputProps, isDragActive: isFileDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileSelected(acceptedFiles[0]),
    maxSize: 200 * 1024 * 1024, // 200MB
  });
  

  const createResource = async () => {
    try {
      if (user && userId && userStatus === 'admin') {
        const resourcesCollectionRef = collection(db, 'resources');
  
        const resourceData = {
          name: resourceName,
          image: resourceImageUrl,
          downloadLink: fileDownloadLink,
          tags: selectedValues,
          createdAt: new Date()
        };
  
        await addDoc(resourcesCollectionRef, resourceData);
        
        message.success('Resource created successfully!');
      } else {
        message.error('An error occurred.. try again later');
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      message.error('Failed to create resource.');
    }
  };

  const onFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    setFileDownloadLink(null);
    setFileUploadProgress(null);
    setFileError(null);
  
    if (file) {
      try {
        setFileIsLoading(true)
  
        // Continue with file upload
        const storageRef = ref(storage, `resources/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress);
        });
  
        await uploadTask;
  
        const fileUrl = await getDownloadURL(storageRef);
        setFileDownloadLink(fileUrl);
  
        message.success('File uploaded successfully!');
      } catch (error) {
        /* console.error('Error uploading file:', error); */
        message.error('Failed to upload file.');
      } finally {
        setFileIsLoading(false)
      }
    }
  }, []);
  

  const onImageSelected = useCallback(async (file: File) => {
    setSelectedImage(file);
    setFileError(null);

    if (file) {
      try {
        setIsLoading(true);

        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!allowedFileTypes.includes(file.type)) {
          setFileError('Invalid file type. Please select a valid image file.');
          setIsLoading(false);
          return;
        }

        const storageRef = ref(storage, `resources/${userId}`);
        await uploadBytes(storageRef, file);

        const imageUrl = await getDownloadURL(storageRef);
        setResourceImageUrl(imageUrl);

        // message.success('Resource picture set successfully!');
      } catch (error) {
        console.error('Error uploading resource picture:', error);
        message.error('Failed to upload resource picture.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (selectedImage) {
      setIsLoading(true); 

      const uploadImage = async () => {
        try {
          const storageRef = ref(storage, `resources/${userId}`);
          await uploadBytes(storageRef, selectedImage);

          const imageUrl = await getDownloadURL(storageRef);
          setResourceImageUrl(imageUrl);

        } catch (error) {
          message.error('Failed to upload resource picture.');
        } finally {
          setIsLoading(false);
        }
      };
      uploadImage();
    }
  }, [selectedImage, userId, fileError]);

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  React.useEffect(() => {
    const tagsRef = collection(db, 'tags');
    const unsubscribe = onSnapshot(tagsRef, (querySnapshot) => {
    const tagNames: string[] = [];
      querySnapshot.forEach((doc) => {
        const tagData = doc.data();
        tagNames.push(tagData.name);
      })

      setTags(tagNames)
    })

    return () => unsubscribe();
  }, [])

  return (
    <div className='p-8 flex flex-col justify-center items-center gap-3'>
      <h1 className="text-lg font-semibold">Create Resource</h1>

      <h1 className='text-lg font-medium w-full text-start'>Name</h1>
      <Input type="text" placeholder="Enter resource name" value={resourceName} onChange={(e) => setResourceName(e.target.value)}/>

      <h1 className='text-lg font-medium w-full text-start'>Image</h1>
      <div
        {...getRootProps()}
        className='border-dashed border-2 border-[--border] hover:border-white/40 hover:bg-black/40 transition duration-200 p-4 rounded-lg text-center cursor-pointer w-full items-center justify-center flex'
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <div className="flex justify-center items-center flex-col gap-3">
            <p className="text-[--highlight]">You can click again to change the image</p>
             <Image
              alt="Profile picture"
              src={URL.createObjectURL(selectedImage)}
              width={100}
              height={100}
              className="p-2 border border-[--border] rounded-lg flex w-[20vh] object-contain mx-auto"
            />
            <button onClick={() => {setSelectedImage(null); setResourceImageUrl(null); setIsLoading(false);}} className="hover:text-white text-[--highlight] transition flex gap-1 items-center"><MdDelete/>Clear Image</button>
          </div>
        ) : <>
          {isDragActive ? (
          <div className='flex flex-col justify-center items-center gap-1'>
            <BsImageFill size={60}/>
            <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
            <p className='text-[18px] italic text-[#707070]'>max file size 20MB - png, jpeg & gif allowed</p>
          </div>
            ) : (
          <div className='flex flex-col justify-center items-center gap-1'>
            <BsImageFill size={50}/>
            <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
            <p className='text-[18px] italic font-normal text-[#707070]'>max file size 20MB - png, gif & jpeg allowed</p>
          </div>
        )}
        </> }
      </div>
      {fileError && <p className="text-red-500">{fileError}</p>}
      <h1 className='text-lg font-medium w-full text-start'>File</h1>
<div
  {...getFileRootProps()}
  className='border-dashed border-2 border-[--border] hover:border-white/40 hover:bg-black/40 transition duration-200 p-2 rounded-lg text-center cursor-pointer w-full items-center justify-center flex'
>
  <input {...getFileInputProps()} />
  {selectedFile ? (
    <div className="flex line-clamp-1 justify-center items-center flex-col gap-2">
      <p className="text-[--highlight]">You can click again to change the file</p>
      <p>{selectedFile.name}</p>
      {fileUploadProgress !== null && (
        <Progress value={fileUploadProgress} />
      )}
      <button onClick={() => {setSelectedFile(null); setFileDownloadLink(null); setFileIsLoading(false)}} className="hover:text-white p-1 text-[--highlight] transition flex gap-1 items-center">
        <MdDelete/> Clear File
      </button>
    </div>
  ) : (
    <>
      {isFileDragActive ? (
        <div className='flex flex-col justify-center items-center gap-1'>
          <AiFillFileAdd size={60}/>
          <p>Drag your files here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
          <p className='text-[18px] italic text-[#707070]'>max file size 200MB</p>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center gap-1'>
          <AiFillFileAdd size={60}/>
          <p>Drag your files here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
          <p className='text-[18px] italic text-[#707070]'>max file size 200MB</p>
        </div>
      )}
    </>
  )}
</div>
  <div className='flex flex-col items-start w-full gap-3'>
    <h1 className='text-lg font-medium'>Tags</h1>
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ButtonShad
            className="w-full justify-between border"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
          {selectedValues.length > 0
            ? selectedValues.join(", ")
            : "Select tag..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </ButtonShad>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search tag..." />
            <CommandEmpty className="gap-2 flex flex-col items-center justify-center">
              <p>No tags found.</p>
              <Dialog>
                <DialogTrigger>
                  <ButtonShad variant="outline">Create tag </ButtonShad>
                </DialogTrigger>
                <DialogContent>
                  <CreateTag/>
                </DialogContent>
              </Dialog>
            </CommandEmpty>
            <CommandGroup>
            {tags.map((tagName) => (
                <CommandItem
                  key={tagName}
                  onSelect={() => toggleSelection(tagName)}
                  className="cursor-pointer"
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(tagName)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {tagName}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
  </div>
      
      <Button onClick={createResource} disabled={!selectedFile || !resourceName || tags.length === 0 || isLoading || fileIsLoading}
      className={clsx({
        'text-[--highlight]': !selectedFile || !resourceName || tags.length === 0 || isLoading || fileIsLoading,
      })}
      >
        {isLoading || fileIsLoading ? 'Loading...' : 'Create Resource'}
      </Button>
    </div>
  )
}
