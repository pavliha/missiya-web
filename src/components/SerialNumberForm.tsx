import type { LiteralUnion } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { type FC } from 'react';
import { RightArrow } from './RightArrow';

const errorMessages: Record<LiteralUnion<'required' | 'pattern', string>, string> = {
  required: 'This field is required. Please enter serial number.',
  pattern: 'Please enter correct serial number.',
};

export interface VideoFormValues {
  serialNumber: string;
}

interface Props {
  onSubmit: (value: VideoFormValues) => Promise<void>;
}

export const SerialNumberForm: FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormValues>();

  const serialNumberErrorType = errors.serialNumber?.type;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[600px] px-4">
      <div className="mb-2 flex">
        <input
          className="w-full rounded-md border border-[#A6A5A5] px-3 py-2 uppercase"
          placeholder="Example: MQ23Z0000001"
          {...register('serialNumber', { required: true, pattern: /^[a-zA-z]{2}[0-9]{2}[a-zA-Z][0-9]{7}/ })}
        />
        <button
          type="submit"
          className="relative ml-2 h-14 w-14 rounded-full p-2 hover:bg-[#F5F5F5] active:bg-[#F1F1F1]"
        >
          <RightArrow />
        </button>
      </div>

      <p className="text-sm text-muted">
        {serialNumberErrorType ? errorMessages[serialNumberErrorType] : 'Please enter your drone serial number'}
      </p>
    </form>
  );
};
