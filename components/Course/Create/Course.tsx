import Button from '@/components/UI Elements/Button';
import Input from '@/components/UI Elements/Input';
import ImageUpload from '@/components/UI Elements/PhotoUploader';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { message } from 'antd';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'

export default function CreateCourse() {

    const { userStatus } = UserDataFetcher();
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseImage, setCourseImage] = useState<string | null>(null);

    const [error, setError] = useState('');

    const handleImageUpload = (imageUrl: string) => {
      setCourseImage(imageUrl);
    };
  
    const handleUpload = async () => {
      const courseData = {
        name: courseName,
        description: courseDescription,
        image: courseImage, // Add the image URL to the course data
      };
  
      try {
        if (userStatus === 'admin') {
          const coursesCollectionRef = collection(db, 'courses');
          await addDoc(coursesCollectionRef, courseData);
          setCourseName('');
          setCourseDescription('');
          setCourseImage(null);
          message.success('Successfully added course: ' + courseName + '. (refresh the page to see it)');
        } else {
          message.error('Unauthorized');
        }
      } catch (error) {
        message.error('Error adding course:', error as number);
      }
    };

  return (
    <div className='flex flex-col justify-center items-center p-5 pt-3 gap-1'>
        <h1 className='text-xl font-medium pb-3'>Upload Course</h1>
          <div className='w-full flex flex-col gap-2'>
          <h1 className='text-lg font-medium w-full text-start'>Name</h1>
          <Input
            type='text'
            placeholder='Enter the lesson name'
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <h1 className='text-lg font-medium w-full text-start'>Description</h1>
          <Input
            type='text'
            placeholder='Enter the course description'
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />

          <h1 className='text-lg font-medium w-full text-start'>Image</h1>
          <ImageUpload onComplete={handleImageUpload} customPath={'courses'} />

        <Button onClick={handleUpload}>Upload</Button>
        {error && <p className="text-red-500">{error}</p>}
        </div>
    </div>
  )
}
