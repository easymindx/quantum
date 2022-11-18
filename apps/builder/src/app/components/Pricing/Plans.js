import React from 'react';
import { Stack } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const planContents = [
  {
    header: 'Free',
    price: 0,
    features: [
      '10 users included',
      '2 GB of storage',
      'Email support',
      'Help center access',
    ],
    buttonLabel: 'Sign up for free',
    outline: true,
  },
  {
    header: 'Pro',
    price: 99,
    features: [
      '20 users included',
      '10 GB of storage',
      'Priority email support',
      'Help center access',
    ],
    buttonLabel: 'Get started',
    outline: false,
  },
  {
    header: 'Enterprise',
    price: 499,
    features: [
      '30 users included',
      '15 GB storage',
      'Phone and email support',
      'Help center access',
    ],
    buttonLabel: 'Contact us',
    outline: false,
  },
];

const Plan = (props) => {
  return (
    <div className="card mb-4 shadow-sm text-center">
      <div className="card-header">
        <h4 className="my-0 font-weight-normal">{props.header}</h4>
      </div>
      <div className="card-body">
        <h1 className="card-title pricing-card-title">
          {`$${props.price}`}
          <small className="text-muted">/ mo</small>
        </h1>
        <ul className="list-unstyled mt-3 mb-4">
          {props.features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
        <button
          className={`btn btn-lg btn-block ${
            props.outline ? 'btn-outline-light' : 'btn-primary'
          }`}
          type="button"
        >
          {props.buttonLabel}
        </button>
      </div>
    </div>
  );
};

const Plans = () => {
  const isMedium = useMediaQuery({
    query: '(min-width: 768px)',
  });

  const plans = planContents.map((obj, i) => {
    return (
      <Plan
        key={obj.header}
        header={obj.header}
        price={obj.price}
        features={obj.features}
        buttonLabel={obj.buttonLabel}
        outline={obj.outline}
      />
    );
  });

  return (
    <Stack
      gap={4}
      direction={isMedium ? 'horizontal' : 'vertical'}
      className="d-flex justify-content-center"
    >
      {plans}
    </Stack>
  );
};

export default Plans;
