interface CardProps {
  id?: string;
  name: string;
  image: string;
  altText: string;
  price: number;
}

export const Card = ({ id, name, image, altText, price }: CardProps) => {
  return (
    <li data-testid={id} className='inline-flex w-64 flex-col text-center lg:w-auto'>
      <div className='group relative'>
        <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200'>
          <img
            src={image}
            alt={altText}
            className='h-full w-full object-cover object-center group-hover:opacity-75'
          />
        </div>
        <div className='mt-6'>
          <h3 className='mt-1 font-semibold text-gray-900'>
            <a href='#'>
              <span className='absolute inset-0' />
              {name}
            </a>
          </h3>
          <p className='mt-1 text-gray-900'>{`${price}€`}</p>
        </div>
      </div>
    </li>
  );
};
