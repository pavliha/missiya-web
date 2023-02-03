import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';

export interface VideoFormData {
  droneID: string;
}

interface Props {
  onSubmit: (value: VideoFormData) => Promise<void>;
}

export const DroneIDForm: FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormData>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-4/12 min-w-fit rounded-lg border border-gray-200 bg-white p-6 shadow"
    >
      <p className="mt-2 mb-4 text-2xl font-semibold">Open Video Stream</p>
      <p className="mt-2">
        Enter your <strong>serial number</strong> to see video from drone
      </p>
      <InputMask
        mask="aa99a9999999"
        className="mt-2 w-full rounded-md border border-[#A6A5A5] px-3 py-2 uppercase"
        placeholder="Example serial number: MQ23Z0000001"
        {...register('droneID', { required: true, pattern: /^[a-zA-z]{2}[0-9]{2}[a-zA-Z][0-9]{7}/ })}
      />
      {errors.droneID?.type === 'required' && (
        <p className="text-sm text-red-700">This field is required. Please enter serial number</p>
      )}
      {errors.droneID?.type === 'pattern' && <p className="text-sm text-red-700">Wrong format</p>}

      <button
        type="submit"
        className="mt-4 rounded-md bg-[#5D5FEF] px-3 py-2 uppercase text-white hover:bg-[#3457D1] active:bg-[#3437D1]"
      >
        Open video stream
      </button>
    </form>
  );
};
