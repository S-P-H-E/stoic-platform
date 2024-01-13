import Button from '@/components/UI Elements/Button';
import Input from '@/components/UI Elements/Input';
import ImageUpload from '@/components/UI Elements/PhotoUploader';
import { ButtonShad } from '@/components/ui/buttonshad';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { sanitizeString } from '@/utils/utils';
import { Checkbox, message } from 'antd';
import clsx from 'clsx';
import { doc, getDocs, collection, setDoc } from 'firebase/firestore';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface CreateLessonProps {
  predefinedCourse?: string | string[];
  predefinedCourseName?: string
}

export default function CreateLesson({predefinedCourse, predefinedCourseName}: CreateLessonProps) {

    const { userStatus } = UserDataFetcher();
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [lessonThumbnail, setLessonThumbnail] = useState<string | null>(null);
    const [lessonURL, setLessonURL] = useState('');
    const [lessonOrder, setLessonOrder] = useState<number>();
    const [lessonLocked, setLessonLocked] = useState(false);
    const [error, setError] = useState('');
  
    const [selectedCourse, setSelectedCourse] = useState('');
    const [open, setOpen] = React.useState(false);
    const [selectedValues, setSelectedValues] = useState('');
  
    const handleImageUpload = (imageUrl: string) => {
      setLessonThumbnail(imageUrl);
    };

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'courses'));
          const coursesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: 'docname',
            ...doc.data(),
          }));
          setCourses(coursesData);

          if (predefinedCourse) {
            setSelectedCourse(String(predefinedCourse));
            setSelectedValues(String(predefinedCourseName));
          }

          if(selectedCourse) {
            const lessonsSnapshot = await getDocs(collection(db, 'courses', selectedCourse, 'lessons'));
            const lessonsData = lessonsSnapshot.docs.map((lessonDoc) => lessonDoc.data());

            const lastLessonOrder = lessonsData.reduce((maxOrder, lesson) => {
              const lessonOrder = parseInt(lesson.order, 10);
              return lessonOrder > maxOrder ? lessonOrder : maxOrder;
            }, 0);

            setLessonOrder(lastLessonOrder + 1);
          }

        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
  
      fetchCourses();
    }, [selectedCourse, predefinedCourse, predefinedCourseName]);
    
    const toggleSelection = (value: string) => {
      if (selectedValues === value) {
        // If the clicked course is already selected, unselect it
        setSelectedValues('');
      } else {
        // Otherwise, select the clicked course
        setSelectedValues(value);
      }
    };
  
    const handleUpload = async () => {
      if (!selectedCourse) {
        setError('Please select a course.');
        return;
      }
  
      // Prepare lesson data
      const lessonData = {
        title: lessonTitle,
        description: lessonDescription,
        url: lessonURL,
        order: lessonOrder,
        thumbnail: lessonThumbnail,
        locked: lessonLocked
      };
  
      // Add the lesson to the selected course's 'lessons' collection
      try {
        if (userStatus == 'admin' ) {
          const customDocId = sanitizeString(lessonTitle)

          const lessonDocRef = doc(db, 'courses', selectedCourse, 'lessons', customDocId);

          await setDoc(lessonDocRef, lessonData);

          setLessonTitle('');
          setLessonDescription('');
          setLessonURL('');
          setLessonOrder(0);
          setLessonThumbnail('')
          setError('');
    
          message.success("Successfully added lesson: " + lessonTitle)
        } else {
          message.error('Unauthorized')
        }
      } catch (error) {
        message.error('Error adding lesson:')
      }
    };
     return (
    <div className='flex flex-col justify-center items-center p-5 pt-3 gap-1'>
        <h1 className='text-xl font-medium pb-3'>Upload Lesson</h1>
        <h1 className='text-lg font-medium w-full'>Course</h1>
        <div className="w-full flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <ButtonShad
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  >
                  {selectedValues.length > 0
                  ? selectedValues
                  : "Select course..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </ButtonShad>
              </PopoverTrigger>
              <PopoverContent className='className="w-[20rem] p-0'>
                <Command>
                  <CommandInput placeholder="Search course..." />
                  <CommandEmpty className="gap-2 flex flex-col items-center justify-center p-4">
                    <p>No course found.</p>
                  </CommandEmpty>
                  <CommandGroup>
                  {courses.map((course) => (
                    <CommandItem key={course.id} value={String(course.name)} onSelect={() => {toggleSelection(String(course.name)); setSelectedCourse(course.id)}}>
                          <Check
                          className={clsx(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(course.name)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      {course.name}
                    </CommandItem>
                  ))}
                  </CommandGroup>
                  </Command>
              </PopoverContent>
            </Popover>
          <h1 className='text-lg font-medium w-full text-start'>Name</h1>
          <Input
            type='text'
            placeholder='Enter the lesson name'
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
          />
          <h1 className='text-lg font-medium w-full text-start'>Description</h1>
          <Input
            type='text'
            placeholder='Enter the lesson description'
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
          />
          <h1 className='text-lg font-medium w-full text-start'>Video URL</h1>
          <Input
            type='text'
            placeholder='Enter the vimeo URL'
            value={lessonURL}
            onChange={(e) => setLessonURL(e.target.value)}
          />

          <h1 className='text-lg font-medium w-full text-start'>Image</h1>
          <ImageUpload onComplete={handleImageUpload} customPath={'lessons'}/>

          <h1 className='text-lg font-medium w-full text-start'>Order</h1>
          <Input
            type='number'
            placeholder='Enter the lesson order number'
            value={lessonOrder === undefined ? '' : String(lessonOrder)}
            onChange={(e) => setLessonOrder(Number(e.target.value))}
          />

          <div className="flex gap-4 items-center">
            <h1 className='text-lg font-medium'>Locked</h1>
            <Checkbox onChange={(e) => setLessonLocked(e.target.checked)} checked={lessonLocked} />
          </div>
        <Button onClick={handleUpload}>Upload</Button>
        {error && <p className="text-red-500">{error}</p>}
        </div>
    </div>
  )
}
