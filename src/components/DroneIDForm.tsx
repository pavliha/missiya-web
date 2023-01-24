import { type FC } from 'react';
import { useForm } from 'react-hook-form';

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
      <input
        className="mt-2 w-full rounded-md bg-white px-3 py-2"
        placeholder="Drone ID"
        {...register('droneID', { required: true, pattern: /^[A-Z]{3}-[0-9]{6}/ })}
      />
      {errors.droneID?.type === 'required' && <span className="text-red-800">This field is required</span>}
      {errors.droneID?.type === 'pattern' && <span className="text-red-800">Wrong format</span>}

      <button
        type="submit"
        className="mt-2 rounded-md bg-violet-500 px-3 py-2 uppercase hover:bg-violet-600 active:bg-violet-700"
      >
        Open video stream
      </button>
    </form>
  );
};
