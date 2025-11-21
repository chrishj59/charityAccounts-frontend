// Component showing Todo list for the current user

export default async function TodoLists() {
  const db = await getUserDb();

  // enhanced PrismaClient automatically filters out
  // the lists that the user doesn't have access to
  const lists = await db.list.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <div>
        {/* client component for creating a new List */}
        <CreateList />

        <ul>
          {lists?.map((list) => (
            <Link href={`/lists/${list.id}`} key={list.id}>
              <li>{list.title}</li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
