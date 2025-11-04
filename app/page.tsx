'use client';

import { MainLayout, Sidebar } from '../src/components/layout';
import { Button } from '../src/components/ui';
import { useUsers } from '../src/hooks';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Files', href: '/files' },
  { name: 'Users', href: '/users' },
];

export default function Home() {
  const { users, loading, error } = useUsers();

  return (
    <MainLayout
      title="Files App"
      sidebar={<Sidebar navigation={navigation} />}
      headerActions={
        <Button variant="primary">
          Upload File
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to your professional Next.js application with MVC architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">F</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Files
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? '...' : users.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Storage Used
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0 MB
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Start
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Your Next.js application is ready with a professional MVC structure.
                {error && (
                  <span className="text-red-600 block mt-1">
                    Note: API endpoints need to be implemented. Error: {error}
                  </span>
                )}
              </p>
            </div>
            <div className="mt-5">
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
