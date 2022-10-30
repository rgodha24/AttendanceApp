/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut, signIn, useSession } from "next-auth/react";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const session = useSession();
  return (
    <Disclosure as='nav' className='bg-red-600'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <Link href='/' passHref>
                  <a className='flex flex-shrink-0 items-center'>
                    <span className='hidden h-8 w-auto lg:block text-white text-3xl '>Brophy Attendance </span>
                    <span className='block h-8 w-auto lg:hidden text-white text-3xl '>Brophy Attendance</span>
                  </a>
                </Link>
                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-4'></div>
                </div>
              </div>
              <Link href='/addClass' passHref>
                <a className='text-white  outline-white h-full justify-center text-center flex flex-col align-middle m-auto  '>
                  <p className=' '>Add Class</p>
                </a>
              </Link>
              <Link href='/addScanner' passHref>
                <a className='text-white ml-4 outline-white h-full justify-center text-center flex flex-col align-middle m-auto  '>
                  <p className=' '>Add Scanner</p>
                </a>
              </Link>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                {/* Profile dropdown */}
                {session.status === "authenticated" ? (
                  <MenuDropdown />
                ) : (
                  <button onClick={() => signIn()} className='text-white text-2xl '>
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pt-2 pb-3'></div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

  function MenuDropdown() {
    return (
      <Menu as='div' className='relative ml-3'>
        <div>
          <Menu.Button className='flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
            {session.status == "authenticated" && (
              <>
                {" "}
                <span className='sr-only'>Open user menu</span>
                <img className='h-8 w-8 rounded-full' src={session.data?.user?.image || ""} alt='' />{" "}
              </>
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'>
          <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {/* <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                  Your Profile
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                  Settings
                </a>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  onClick={() => signOut()}
                  className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                  Sign out
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }
}
