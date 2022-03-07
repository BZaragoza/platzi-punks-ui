import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useState } from 'react'
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";

import { usePlatziPunkData } from '../../hooks/usePlatziPunksData';
import { usePlatziPunks } from '../../hooks/usePlatziPunks/index';

import Loading from "../../components/loading";
import PunkCard from "../../components/punk-card";
import RequestAccess from "../../components/request-access";

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, punk, update } = usePlatziPunkData(tokenId);
  const toast = useToast();
  const [isTransfering, setIsTransfering] = useState(false);
  const platziPunks = usePlatziPunks();

  if (!active) return <RequestAccess />;
  if (loading) return <Loading />;

  const isOwner = account !== punk.owner;

  const transfer = () => {  
    setIsTransfering(true);
    
    const address = prompt("Ingresa la dirección");
    const isAddress = library.utils.isAddress(address);

    if (!isAddress) {
      toast({
        title: 'Dirección inválida',
        description: 'La dirección no es una dirección de Ethereum',
        status: 'error'
      })
      setIsTransfering(false);
    } else {
      platziPunks.methods.safeTransferFrom(punk.owner, address, tokenId)
        .send({from: account})
        .on('error', () => {
          setIsTransfering(false)
        })
        .on('transactionHash', txHash => {
          toast({
            title: 'Transacción enviada',
            description: txHash,
            status: 'info',
            isClosable: true,
          })
        })
        .on('receipt', () => {
          setIsTransfering(false)
          toast({
            title: 'Transacción confirmada',
            description: `El punk ahora pertenece a ${address}`,
            status: 'success',
            isClosable: true,
          })

          update()
        })
    }


  }
  
  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={punk.name}
          image={punk.image}
        />
        <Button 
          isLoading={isTransfering}
          disabled={isOwner} 
          colorScheme="green"
          onClick={transfer}
        >
          {isOwner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;