import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import Image from 'next/image';

import { type FC } from 'react';

export interface VideoFormData {
  droneID: string;
}

interface Props {
  onSubmit: (value: VideoFormData) => Promise<void>;
}

export const SerialNumberForm: FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormData>();

  const errorDroneType = errors.droneID?.type;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-4/12 min-w-fit rounded-lg border border-gray-200 bg-white p-6 pr-3 shadow"
    >
      <p className="mt-2 mb-4 text-xl">Please enter UAV serial number to continue:</p>

      <div className="mb-2 flex">
        <InputMask
          mask="aa99a9999999"
          className="w-full rounded-md border border-[#A6A5A5] px-3 py-2 uppercase"
          placeholder="Example: MQ23Z0000001"
          {...register('droneID', { required: true, pattern: /^[a-zA-z]{2}[0-9]{2}[a-zA-Z][0-9]{7}/ })}
        />
        <button
          type="submit"
          className="relative ml-2 h-14 w-14 rounded-full p-2 hover:bg-[#F5F5F5] active:bg-[#F1F1F1]"
        >
          <Image src="/rightArrow.svg" fill alt="Right Arrow" />
        </button>
      </div>

      {errorDroneType === 'required' && (
        <p className="text-sm text-red-700">This field is required. Please enter serial number.</p>
      )}
      {errorDroneType === 'pattern' && <p className="text-sm text-red-700">Please enter correct serial number.</p>}
    </form>
  );
};
