import { CardStripe } from '../../components/card-stripe';
import { Suspense } from 'react';
import { getAllProducts } from '../../services/products';
import { Card } from '../../components/card';
import { createSuspenseResource } from '../../utils/suspence/create-suspense-resource';

export const ProductView = () => {
  const productResource = createSuspenseResource(getAllProducts());
  return (
    <>
      <Suspense fallback={<div>🌀 Loading...</div>}>
        <CardStripe
          resource={productResource}
          title={'Products'}
          render={(response) => {
            return response.map((product) => {
              const [image] = product.images ?? [];
              return (
                <Card
                  key={product.productId}
                  id={product.productId}
                  name={product.name}
                  image={image}
                  altText={product.name}
                  price={product.price}
                />
              );
            });
          }}
        />
        ;
      </Suspense>
    </>
  );
};
