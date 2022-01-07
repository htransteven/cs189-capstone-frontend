import Link from 'next/link';
import React from 'react';
import Tag from '../Tag';

export const ProviderHome = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap -mx-4">
        {/* element 1 */}
        <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
          <Link href="/fill-in-later">
            <a
              href=""
              className="block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden h-auto"
            >
              <header className="font-bold bg-purple-800 h-16 justify-center">
                <div className="flex justify-center pt-1">
                  <h2 className="font-bold text-white">
                    Appointment #102391923
                  </h2>
                </div>
                <div className="flex justify-center pt-1">
                  <h2 className="font-bold text-white">
                    Friday, 10/29/2021 @ 3:15 PM
                  </h2>
                </div>
              </header>
              <div className="p-4">
                <div className="flex flex-col">
                  <p className="text-purple-700 text-bold">Location</p>
                  <p className="text-sm">
                    7402 Hollister Ave, Goleta, CA 93117
                  </p>
                </div>
                <div className="mt-3 flex flex-col">
                  <p className="text-purple-700 text-bold">
                    Patient Information
                  </p>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Name: </p>
                    <p className="text-sm">Evan Yip</p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Birthday: </p>
                    <p className="text-sm">12/12/1999</p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Insured: </p>
                    <p className="text-sm">Yes</p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">
                      Preconsult Completed:
                    </p>
                    <p className="text-sm">No</p>
                  </div>
                </div>

                <p className="text-purple-700 text-bold mt-3">Tags</p>
                <div className="flex">
                  <div className="flex flex-wrap mt-1">
                    <Tag
                      text="Back Pain test"
                      background="bg-gray-200"
                      textColor="text-gray-700"
                    />
                    <Tag
                      text="Covid-19"
                      background="bg-indigo-300"
                      textColor="text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-b text-xs text-gray-700">
                <span className="flex items-center">See Report</span>
              </div>
            </a>
          </Link>
        </div>

        {/* element 2 */}
        <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
          <Link href="/fill-in-later">
            <a
              href=""
              className="block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden h-auto"
            >
              <header className="font-bold bg-purple-800 h-16 justify-center">
                <div className="flex justify-center pt-1">
                  <h2 className="font-bold text-white">
                    Appointment #102391923
                  </h2>
                </div>
                <div className="flex justify-center pt-1">
                  <h2 className="font-bold text-white">
                    Friday, 10/29/2021 @ 3:15 PM
                  </h2>
                </div>
              </header>
              <div className="p-4">
                <div className="flex flex-col">
                  <p className="text-purple-700 text-bold">Location</p>
                  <p className="text-sm">
                    7402 Hollister Ave, Goleta, CA 93117
                  </p>
                </div>
                <div className="mt-3 flex flex-col">
                  <p className="text-purple-700 text-bold">
                    Patient Information
                  </p>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Name: </p>
                    <p className="text-sm">Evan Yip</p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Birthday: </p>
                    <p className="text-sm">12/12/1999</p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Insured: </p>
                    <p className="text-sm">Yes</p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">
                      Preconsult Completed:
                    </p>
                    <p className="text-sm">No</p>
                  </div>
                </div>
                <p className="text-purple-700 text-bold mt-3">Tags</p>
              </div>
              <div className="p-4 border-t border-b text-xs text-gray-700">
                <span className="flex items-center">See Report</span>
              </div>
            </a>
          </Link>
        </div>
        {/* end body div */}
      </div>
    </div>
  );
};
