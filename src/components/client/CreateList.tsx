'use client';

import { createList } from '~/app/actions/actions';

export default function CreateList() {
  function onCreate() {
    const title = prompt('Enter a title for your list');
    if (title) {
      createList(title);
    }
  }

  return <button onClick={onCreate}>Create a list</button>;
}
