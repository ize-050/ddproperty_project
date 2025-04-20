"use client";
import React from 'react';
import ReactSelect from 'react-select';

/**
 * A wrapper component for React Select that adds a consistent instanceId
 * to prevent hydration errors between server and client rendering.
 */
const SelectWithInstanceId = React.forwardRef((props, ref) => {
  const { instanceId, ...restProps } = props;
  
  // Generate a consistent instanceId based on the provided one or a default
  const selectInstanceId = instanceId || 'select-component';
  
  return (
    <ReactSelect
      ref={ref}
      instanceId={selectInstanceId}
      {...restProps}
    />
  );
});

SelectWithInstanceId.displayName = 'SelectWithInstanceId';

export default SelectWithInstanceId;
