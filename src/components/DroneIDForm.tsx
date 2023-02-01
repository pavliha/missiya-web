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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
      <p className="mt-2 text-white">Enter your DRONE ID to see video from drone</p>
      <InputMask
        mask="AA99A9999999"
        className="mt-2 w-full rounded-md bg-white px-3 py-2"
        placeholder="Example Drone ID: MQ23Z0000001"
        {...register('droneID', { required: true, pattern: /^[A-Z]{2}[0-9]{2}[A-Z][0-9]{7}/ })}
      />
      {errors.droneID?.type === 'required' && <span className="text-red-800">This field is required</span>}
      {errors.droneID?.type === 'pattern' && <span className="text-red-800">Wrong format</span>}

      <button
        type="submit"
        className="mt-3 rounded-md bg-violet-500 px-3 py-2 uppercase hover:bg-violet-600 active:bg-violet-700"
      >
        Open video stream
      </button>
    </form>
  );
};
