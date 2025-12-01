'use client'
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'What services do you offer?',
        children: (
            <p>
                We provide complete interior design, architectural planning, 3D visualization,
                material selection, custom furniture, renovation, and turnkey execution.
            </p>
        ),
    },
    {
        key: '2',
        label: 'How does the design process work?',
        children: (
            <p>
                After an initial consultation, we create concept designs, layout plans,
                and 3D renders. Once approved, our execution team handles the full build-out.
            </p>
        ),
    },
    {
        key: '3',
        label: 'Do you handle both residential and commercial projects?',
        children: (
            <p>
                Yes. We specialize in homes, offices, retail spaces, restaurants, and
                luxury real estate projects.
            </p>
        ),
    },
    {
        key: '4',
        label: 'Can I customize materials and finishes?',
        children: (
            <p>
                Absolutely. We offer material boards, finish samples, and personalized options
                to match your taste and budget.
            </p>
        ),
    },
];


const Accordion: React.FC = () => {
    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    return <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} size='large' />;
};

export default Accordion;