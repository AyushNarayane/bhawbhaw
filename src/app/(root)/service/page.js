import BodyConditionScore from '@/components/BodyCondition';
import MoreInfo from '@/components/details';
import ServiceHeader from '@/components/ServiceHeader';
import React from 'react';

const Page = () => {
  return (
    <div className='bg-white max-w-5xl mx-auto flex flex-col items-center'>
      <ServiceHeader />
      <MoreInfo />
      <BodyConditionScore />
    </div>
  );
}

export default Page;
